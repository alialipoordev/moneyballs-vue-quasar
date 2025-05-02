<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useStoreEntries } from "./stores/storeEntries";
import { useStoreSettings } from "./stores/storeSettings";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

defineOptions({
  name: "App",
});

const storeSettings = useStoreSettings(),
  storeEntries = useStoreEntries(),
  $q = useQuasar(),
  router = useRouter();

onMounted(() => {
  storeSettings.loadSettings();
  storeEntries.loadEntries();

  if ($q.platform.is.electron) {
    ipcRenderer.on("show-settings", () => {
      router.push("/settings");
    });
  }
});
</script>
