<template>
  <q-layout view="hHh lpR lFf">
    <q-header :elevated="useLightOrDark(true, false)">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <div class="absolute-center">
            <div class="toolbar-title-text">
              <q-icon name="savings" />
              MoneyBalls
            </div>
          </div>
        </q-toolbar-title>

        <q-btn
          v-if="$route.fullPath === '/'"
          @click="storeEntries.options.sort = !storeEntries.options.sort"
          :label="!storeEntries.options.sort ? 'Sort' : 'Done'"
          flat
          no-caps
          dense
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      :width="250"
      :breakpoint="767"
      class="bg-primary"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label class="text-white" header> Navigation </q-item-label>

        <NavLink v-for="link in navLinks" :key="link.title" v-bind="link" />

        <q-item
          v-if="storeAuth.isAuthenticated"
          @click="logout"
          clickable
          tag="a"
          class="text-white shadow-up-2"
        >
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Logout</q-item-label>
            <q-item-label class="text-caption text-weight-light">{{
              storeAuth.user?.email
            }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="$q.platform.is.electron"
          @click="quitApp"
          clickable
          class="text-white absolute-bottom"
          tag="a"
        >
          <q-item-section avatar>
            <q-icon name="power_settings_new" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Quit</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import NavLink from "src/components/Nav/NavLink.vue";
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useStoreEntries } from "src/stores/storeEntries";
import { useLightOrDark } from "src/use/useLightOrDark";
import { useAuthStore } from "src/stores/storeAuth";
import { logoutUser } from "src/services/auth.service";

const storeEntries = useStoreEntries(),
  $q = useQuasar(),
  router = useRouter(),
  storeAuth = useAuthStore();

const navLinks = [
  {
    title: "Entries",
    icon: "savings",
    link: "/",
  },
  {
    title: "Settings",
    icon: "settings",
    link: "/settings",
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const quitApp = () => {
  $q.dialog({
    title: "Confirm",
    message: "Really quit MoneyBalls?",
    cancel: true,
    persistent: true,
    html: true,
    ok: {
      label: "Quit",
      color: "negative",
      noCaps: true,
    },
    cancel: {
      color: "primary",
      noCaps: true,
    },
  }).onOk(() => {
    if ($q.platform.is.electron) ipcRenderer.send("quit-app");
  });
};

const logout = async () => {
  try {
    await logoutUser();
    storeAuth.setUser(null);
    router.push("/login");
  } catch (error) {
    console.error(error);
  }
};
</script>
