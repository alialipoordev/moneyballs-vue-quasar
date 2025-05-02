<script setup lang="ts">
import { useLightOrDark } from "src/use/useLightOrDark";
</script>

<template>
  <div class="text-center q-pt-xl">
    <q-icon
      :color="useLightOrDark('grey-4', 'grey-9')"
      name="savings"
      size="100px"
    />
    <div
      class="text-grey-5"
      :class="useLightOrDark('text-grey-5', 'text-grey-7')"
    >
      No entries yet
    </div>
  </div>
</template>
