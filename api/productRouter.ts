import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products } from "@db/schema";
import { eq, and, like, desc } from "drizzle-orm";

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          categoryId: z.number().optional(),
          search: z.string().optional(),
          featured: z.enum(["yes", "no"]).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.categoryId) {
        conditions.push(eq(products.categoryId, input.categoryId));
      }
      if (input?.search) {
        conditions.push(like(products.name, `%${input.search}%`));
      }
      if (input?.featured) {
        conditions.push(eq(products.featured, input.featured));
      }

      if (conditions.length > 0) {
        return db
          .select()
          .from(products)
          .where(and(...conditions))
          .orderBy(desc(products.createdAt));
      }

      return db.query.products.findMany({
        orderBy: (products, { desc }) => [desc(products.createdAt)],
      });
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getDb().query.products.findFirst({
        where: eq(products.id, input.id),
        with: {
          category: true,
        },
      });
    }),

  featured: publicQuery.query(async () => {
    return getDb().query.products.findMany({
      where: eq(products.featured, "yes"),
      with: {
        category: true,
      },
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      limit: 8,
    });
  }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.string().min(1),
        unit: z.string().default("piece"),
        categoryId: z.number(),
        image: z.string().optional(),
        stock: z.number().default(0),
        featured: z.enum(["yes", "no"]).default("no"),
      })
    )
    .mutation(async ({ input }) => {
      const [result] = await getDb()
        .insert(products)
        .values({
          name: input.name,
          description: input.description,
          price: input.price,
          unit: input.unit,
          categoryId: input.categoryId,
          image: input.image,
          stock: input.stock,
          featured: input.featured,
        })
        .$returningId();
      return getDb().query.products.findFirst({
        where: eq(products.id, result.id),
        with: {
          category: true,
        },
      });
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        unit: z.string().optional(),
        categoryId: z.number().optional(),
        image: z.string().optional(),
        stock: z.number().optional(),
        featured: z.enum(["yes", "no"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await getDb()
        .update(products)
        .set(data)
        .where(eq(products.id, id));
      return getDb().query.products.findFirst({
        where: eq(products.id, id),
        with: {
          category: true,
        },
      });
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await getDb().delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),
});
