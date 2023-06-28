import { createRouter, createWebHistory } from "vue-router";
import routerMap from "./constantRouterMap";

const router = createRouter({
  history: createWebHistory(),
  routes: routerMap,
});

router.beforeEach(async (to, from, next) => {
  next();
});
export default router;
