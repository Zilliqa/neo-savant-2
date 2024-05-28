<template>
  <q-bar class="bg-dark text-white shadow-2">
    <q-toolbar-title class="text-bold"
      >{{ props.contractName }}
      <span class="text-grey-5 text-weight-regular"
        >contract</span
      ></q-toolbar-title
    >
  </q-bar>
</template>

<script setup lang="ts">
const props = defineProps(['contractName']);
</script>
