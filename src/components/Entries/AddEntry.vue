<template>
  <q-form
    @submit="addEntryFormSubmit"
    class="row q-px-sm q-pb-sm q-col-gutter-sm bg-primary"
  >
    <div class="col">
      <q-input
        v-model="addEntryForm.name"
        ref="nameRef"
        outlined
        placeholder="Name"
        :bg-color="useLightOrDark('white', 'black')"
        dense
        v-select-all
      />
    </div>
    <div class="col">
      <q-input
        v-model.number="addEntryForm.amount"
        :rules="[
          (val) =>
            typeof val === 'number' || val === null || 'Enter a valid number',
        ]"
        type="number"
        step="0.01"
        input-class="text-right"
        outlined
        placeholder="Amount"
        :bg-color="useLightOrDark('white', 'black')"
        dense
        v-select-all
      />
    </div>
    <div class="col col-auto">
      <q-btn round color="primary" icon="add" type="submit" />
    </div>
  </q-form>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useStoreEntries } from "src/stores/storeEntries";
import { reactive, ref } from "vue";
import vSelectAll from "src/directives/directiveSelectAll";
import { useLightOrDark } from "src/use/useLightOrDark";

const storeEntries = useStoreEntries();

const $q = useQuasar();

const nameRef = ref(null);

const addEntryFormDefault = {
  name: "",
  amount: null,
};

const addEntryForm = reactive({
  ...addEntryFormDefault,
});

function addEntryFormReset() {
  Object.assign(addEntryForm, addEntryFormDefault);
  nameRef.value.focus();
}

function addEntryFormSubmit() {
  storeEntries.addEntry(addEntryForm);
  addEntryFormReset();
}
</script>
