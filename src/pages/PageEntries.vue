<template>
  <q-page>
    <div class="q-pa-md">
      <template v-if="storeEntries.entriesLoaded">
        <transition appear enter-active-class="animated jackInTheBox slower">
          <NothingHere v-if="!storeEntries.entriesOrdered.length" />
        </transition>

        <q-list v-if="storeEntries.entriesOrdered.length" class="entries">
          <Sortable
            :list="storeEntries.entriesOrdered"
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
      </template>

      <div v-else class="text-center q-pa-xl">
        <q-spinner color="primary" size="3em" :thickness="10" />
      </div>
    </div>

    <q-footer class="bg-transparent">
      <transition
        appear
        enter-active-class="animated fadeInUp"
        leave-active-class="animated fadeOutDown"
      >
        <Balance v-if="storeEntries.entriesOrdered.length" />
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
