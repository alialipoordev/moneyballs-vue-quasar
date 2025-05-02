<template>
  <div
    :class="useLightOrDark('bg-white shadow-up-3', 'bg-black')"
    class="row q-mb-sm q-px-md q-py-sm items-center"
  >
    <div class="col text-grey-7 text-h6">Balance:</div>
    <div
      class="col text-h6 text-right"
      :class="useAmountColorClass(storeEntries.balance)"
    >
      <div class="row">
        <div class="col">
          {{ useCurrencyFormat(storeEntries.balance) }}
        </div>
      </div>

      <div class="row" v-if="storeEntries.balancePaid">
        <div class="col text-caption text-grey-6">
          Paid:
          <span
            class="text-weight-bold"
            :class="useAmountColorClass(storeEntries.balancePaid)"
          >
            {{ useCurrencyFormat(storeEntries.balancePaid) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCurrencyFormat } from "src/use/useCurrencyFormat";
import { useAmountColorClass } from "src/use/useAmountColorClass";
import { useStoreEntries } from "src/stores/storeEntries";
import { useLightOrDark } from "src/use/useLightOrDark";

const storeEntries = useStoreEntries();
</script>
