import {
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHistory,
} from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("./pages/Home.vue"),
  },
];

export const createRouter = () =>
  _createRouter({
    history: import.meta.env.SSR
      ? createMemoryHistory("/")
      : createWebHistory("/"),
    routes,
  });
