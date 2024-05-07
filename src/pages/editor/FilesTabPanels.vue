<template>
  <q-tabs
    v-model="tab"
    dense
    class="bg-grey-3"
    active-color="primary"
    indicator-color="primary"
    align="left"
    narrow-indicator
    no-caps
  >
    <q-tab v-for="file in filesStore.openFiles" :name="file" :label="file" :key="file" />
  </q-tabs>
</template>

<script setup lang="ts">
import { useFilesStore } from 'src/stores/files';
import {ref} from 'vue';
// import EditorTab from './EditorTab.vue';

const tab = ref('tab');
const filesStore = useFilesStore();
</script>
