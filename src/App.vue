<template>
  <router-view />
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useStoreEntries } from "./stores/storeEntries";
import { useStoreSettings } from "./stores/storeSettings";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useAuthStore } from "./stores/storeAuth";

defineOptions({
  name: "App",
});

const storeSettings = useStoreSettings(),
  storeEntries = useStoreEntries(),
  $q = useQuasar(),
  router = useRouter(),
  storeAuth = useAuthStore();

onMounted(() => {
  storeSettings.loadSettings();

  if ($q.platform.is.electron) {
    ipcRenderer.on("show-settings", () => {
      router.push("/settings");
    });
  }
});

watch(
  () => storeAuth.user,
  (user) => {
    if (user?.uid) {
      storeEntries.loadEntries();
    } else {
      storeEntries.clearEntries();
    }
  },
  { immediate: true }
);
</script>
