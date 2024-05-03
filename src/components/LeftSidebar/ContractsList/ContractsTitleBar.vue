<template>
  <q-bar class="bg-dark text-white shadow-2">
    <q-toolbar-title>Contracts</q-toolbar-title>
    <q-space />
    <q-btn class="gt-xs" size="10px" flat dense round icon="file_download" @click="showImportContractDialog">
      <q-tooltip>Import contract</q-tooltip>
    </q-btn>
  </q-bar>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import ImportContractDialog from './ImportContractDialog.vue';
const q = useQuasar();

function showImportContractDialog() {
  q.dialog({
    component: ImportContractDialog,
  });
}
</script>
