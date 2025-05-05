import { auth } from "src/firebase/firebase";
import { useAuthStore } from "src/stores/storeAuth";
import { onAuthStateChanged } from "firebase/auth";

export default async ({ router }) => {
  const storeAuth = useAuthStore();

  await new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!user.emailVerified) {
          // Notify.create({
          //   message: "Please verify your email before accessing the app.",
          //   position: "top",
          //   color: "warning",
          // });

          storeAuth.setUser(null);
        } else {
          storeAuth.setUser(user);
        }
      } else {
        storeAuth.setUser(null);
      }
      resolve();
    });
  });

  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !storeAuth.isAuthenticated) {
      next("/login");
    } else if (to.meta.requiresGuest && storeAuth.isAuthenticated) {
      next("/");
    } else {
      next();
    }
  });
};
