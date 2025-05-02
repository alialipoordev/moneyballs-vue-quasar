<template>
  <q-slide-item
    @left="onEntrySlideLeft"
    @right="onEntrySlideRight"
    right-color="negative"
    :id="`id-${entry.id}`"
    :class="
      !entry.paid
        ? useLightOrDark('bg-white', 'bg-black')
        : useLightOrDark('bg-grey-2', 'bg-grey-10')
    "
  >
    <template v-slot:right>
      <q-icon name="delete" />
    </template>
    <template v-slot:left>
      <q-icon name="done" />
    </template>

    <q-item class="row">
      <q-item-section
        class="text-weight-bold col"
        :class="[
          useAmountColorClass(entry.amount),
          { 'text-strike': entry.paid },
        ]"
      >
        {{ entry.name }}
        <q-popup-edit
          @save="onNameUpdate($event, entry.id)"
          :model-value="entry.name"
          auto-save
          v-slot="scope"
          :cover="false"
          :offset="[16, 12]"
          anchor="top left"
          label-set="Ok"
          buttons
        >
          <q-input
            v-model="scope.value"
            @keyup.enter="scope.set"
            input-class="text-weight-bold letter-spacing-none"
            v-select-all
            v-autofocus
            dense
          />
        </q-popup-edit>
      </q-item-section>

      <q-item-section
        class="text-weight-bold relative-position col"
        :class="useAmountColorClass(entry.amount)"
        side
      >
        <span :class="{ 'text-strike': entry.paid }">
          {{ useCurrencyFormat(entry.amount) }}
        </span>
        <q-popup-edit
          @save="onAmountUpdate($event, entry.id)"
          :model-value="entry.amount"
          :validate="(val) => typeof val === 'number'"
          v-slot="scope"
          :cover="false"
          :offset="[16, 12]"
          anchor="top right"
          self="top right"
          label-set="Ok"
          auto-save
          buttons
        >
          <q-input
            v-model.number="scope.value"
            @keyup.enter="scope.set"
            :rules="[
              (val) => typeof val === 'number' || 'Enter a valid number',
            ]"
            input-class="text-weight-bold letter-spacing-none text-right"
            type="number"
            step="0.01"
            v-select-all
            v-autofocus
            dense
          />
        </q-popup-edit>
        <q-chip
          v-if="storeSettings.settings.showRunningBalance"
          :class="useAmountColorClass(storeEntries.runningBalances[index])"
          class="running-balance absolute-bottom-right"
          size="9px"
          outline
          dense
        >
          {{ useCurrencyFormat(storeEntries.runningBalances[index]) }}
        </q-chip>
      </q-item-section>

      <q-item-section v-if="storeEntries.options.sort" side>
        <q-icon class="handle" name="reorder" color="primary" />
      </q-item-section>
    </q-item>
  </q-slide-item>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useStoreEntries } from "src/stores/storeEntries";
import { useAmountColorClass } from "src/use/useAmountColorClass";
import { useCurrencyFormat } from "src/use/useCurrencyFormat";
import vSelectAll from "src/directives/directiveSelectAll";
import vAutofocus from "src/directives/directiveAutofocus";
import { useStoreSettings } from "src/stores/storeSettings";
import { useLightOrDark } from "src/use/useLightOrDark";

const props = defineProps({
  entry: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const storeEntries = useStoreEntries(),
  storeSettings = useStoreSettings();

const $q = useQuasar();

function onEntrySlideLeft({ reset }) {
  storeEntries.updateEntry(props.entry.id, { paid: !props.entry.paid });
  reset();
}

function onEntrySlideRight({ reset }) {
  if (storeSettings.settings.promptToDelete) promptToDelete(reset);
  else storeEntries.deleteEntry(props.entry.id);
}

async function promptToDelete(reset) {
  $q.dialog({
    title: "Delete Entry",
    message: `
    Delete this entry?
    <div class="q-mt-md text-weight-bold ${useAmountColorClass(
      props.entry.amount
    )}">
      ${props.entry.name} : ${useCurrencyFormat(props.entry.amount)}
    </div>
    `,
    cancel: true,
    persistent: true,
    html: true,
    ok: {
      color: "negative",
      label: "Delete",
      noCaps: true,
    },
    cancel: {
      color: "positive",
      noCaps: true,
    },
  })
    .onOk(() => {
      storeEntries.deleteEntry(props.entry.id);
    })
    .onCancel(() => {
      reset();
    });
}

function onNameUpdate(value, entryId) {
  storeEntries.updateEntry(entryId, { name: value });
}

function onAmountUpdate(value, entryId) {
  storeEntries.updateEntry(entryId, {
    amount: value,
  });
}
</script>
