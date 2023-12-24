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
    {
      path: "/galaxy",
      component: () => import("../pages/Galaxy.vue"),
    },
    {
      path: "/scroll",
      component: () => import("../pages/Scroll.vue"),
    },
  ],
});

export default router;
