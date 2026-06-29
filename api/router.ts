import { authRouter } from "./auth-router";
import { categoryRouter } from "./categoryRouter";
import { productRouter } from "./productRouter";
import { orderRouter } from "./orderRouter";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  category: categoryRouter,
  product: productRouter,
  order: orderRouter,
});

export type AppRouter = typeof appRouter;
