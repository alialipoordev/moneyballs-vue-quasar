const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      { path: "", component: () => import("src/pages/PageEntries.vue") },
      {
        path: "settings",
        component: () => import("src/pages/PageSettings.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("pages/Login.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    component: () => import("pages/Register.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/forgot-password",
    component: () => import("pages/ForgotPassword.vue"),
    meta: { requiresGuest: true },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
