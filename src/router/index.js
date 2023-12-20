import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      component: () => import("@/pages/home.vue"),
    },
    {
      path: "/about",
      component: () => import("../pages/About.vue"),
    },
    {
      path: "/tank",
      component: () => import("../pages/Tank.vue"),
    },
  ],
});

export default router;