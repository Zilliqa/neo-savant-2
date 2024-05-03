<template>
  <q-bar class="bg-dark text-white shadow-2">
    <q-toolbar-title>Files</q-toolbar-title>
    <q-space />
    <div class="q-gutter-xs">
      <q-btn class="gt-xs" size="10px" flat dense round icon="add" @click="newFileClicked">
        <q-tooltip>New scilla file</q-tooltip>
      </q-btn>
      <q-btn class="gt-xs" size="10px" flat dense round icon="file_download">
        <q-tooltip>Open scilla file</q-tooltip>
      </q-btn>
    </div>
  </q-bar>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useFilesStore } from 'src/stores/files';
const q = useQuasar();

const newFileClicked = () => {
  const filesStore = useFilesStore();
  q.dialog({
    title: 'New File',
    message: 'Enter a name:',
    prompt: {
      model: '',
      type: 'text'
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    try {
      filesStore.addNew(data, '')
    } catch (error) {
      q.notify({
        type: 'warning',
        message: `${error}`
      })
    }
  })
}
</script>
