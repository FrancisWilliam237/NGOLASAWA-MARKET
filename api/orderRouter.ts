import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, orderItems, products } from "@db/schema";
import { eq, desc, like } from "drizzle-orm";

function generateOrderNumber(): string {
  const prefix = "NGM";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

export const orderRouter = createRouter({
  list: adminQuery.query(async () => {
    return getDb().query.orders.findMany({
      orderBy: [desc(orders.createdAt)],
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });
  }),

  byPhone: publicQuery
    .input(z.object({ phone: z.string() }))
    .query(async ({ input }) => {
      return getDb().query.orders.findMany({
        where: like(orders.customerPhone, `%${input.phone}%`),
        orderBy: [desc(orders.createdAt)],
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
      });
    }),

  byOrderNumber: publicQuery
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ input }) => {
      return getDb().query.orders.findFirst({
        where: eq(orders.orderNumber, input.orderNumber),
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
      });
    }),

  create: publicQuery
    .input(
      z.object({
        customerName: z.string().min(1),
        customerPhone: z.string().min(1),
        customerEmail: z.string().optional(),
        address: z.string().min(1),
        zone: z.string().min(1),
        instructions: z.string().optional(),
        paymentMethod: z.enum(["orange_money", "mtn_momo"]),
        total: z.string().min(1),
        items: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number().min(1),
            price: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const orderNumber = generateOrderNumber();

      const [result] = await db
        .insert(orders)
        .values({
          orderNumber,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerEmail: input.customerEmail,
          address: input.address,
          zone: input.zone,
          instructions: input.instructions,
          paymentMethod: input.paymentMethod,
          total: input.total,
        })
        .$returningId();

      const orderId = result.id;

      for (const item of input.items) {
        await db.insert(orderItems).values({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });

        await db
          .update(products)
          .set({
            stock: db
              .select()
              .from(products)
              .where(eq(products.id, item.productId))
              .then(() => {}),
          })
          .where(eq(products.id, item.productId));
      }

      return db.query.orders.findFirst({
        where: eq(orders.id, orderId),
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
      });
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum([
          "pending",
          "confirmed",
          "preparing",
          "out_for_delivery",
          "delivered",
          "cancelled",
        ]),
      })
    )
    .mutation(async ({ input }) => {
      await getDb()
        .update(orders)
        .set({ status: input.status })
        .where(eq(orders.id, input.id));
      return getDb().query.orders.findFirst({
        where: eq(orders.id, input.id),
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
      });
    }),
});
