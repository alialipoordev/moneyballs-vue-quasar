<template>
  <q-page>
    <div class="q-pa-md">
      <transition appear enter-active-class="animated jackInTheBox slower">
        <NothingHere v-if="!storeEntries.entries.length" />
      </transition>

      <q-list v-if="storeEntries.entries.length" class="entries">
        <Sortable
          :list="storeEntries.entries"
          item-key="id"
          :options="{ handle: '.handle' }"
          @end="storeEntries.sortEnd"
          tag="div"
        >
          <template #item="{ element, index }">
            <Entry :key="element.id" :entry="element" :index="index" />
          </template>
        </Sortable>
      </q-list>
    </div>

    <q-footer class="bg-transparent">
      <transition
        appear
        enter-active-class="animated fadeInUp"
        leave-active-class="animated fadeOutDown"
      >
        <Balance v-if="storeEntries.entries.length" />
      </transition>
      <AddEntry />
    </q-footer>
  </q-page>
</template>

<script setup>
import { useStoreEntries } from "src/stores/storeEntries";
import { Sortable } from "sortablejs-vue3";
import Entry from "src/components/Entries/Entry.vue";
import AddEntry from "src/components/Entries/AddEntry.vue";
import NothingHere from "src/components/Entries/NothingHere.vue";
import Balance from "src/components/Entries/Balance.vue";

const storeEntries = useStoreEntries();
</script>
