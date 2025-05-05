import { defineStore } from "pinia";
import { initAuth } from "src/services/auth.service";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = ref(false);

  const setUser = (userData) => {
    user.value = userData;
    isAuthenticated.value = !!userData;
  };

  // Initialize auth state listener
  initAuth((userData) => {
    setUser(userData);
  });

  return { user, isAuthenticated, setUser };
});
