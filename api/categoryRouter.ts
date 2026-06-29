import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { categories } from "@db/schema";
import { eq } from "drizzle-orm";

export const categoryRouter = createRouter({
  list: publicQuery.query(async () => {
    return getDb().query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
  }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getDb().query.categories.findFirst({
        where: eq(categories.id, input.id),
      });
    }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return getDb().query.categories.findFirst({
        where: eq(categories.slug, input.slug),
      });
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [result] = await getDb()
        .insert(categories)
        .values({
          name: input.name,
          slug: input.slug,
          description: input.description,
          image: input.image,
        })
        .$returningId();
      return getDb().query.categories.findFirst({
        where: eq(categories.id, result.id),
      });
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        description: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await getDb()
        .update(categories)
        .set(data)
        .where(eq(categories.id, id));
      return getDb().query.categories.findFirst({
        where: eq(categories.id, id),
      });
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await getDb().delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});
