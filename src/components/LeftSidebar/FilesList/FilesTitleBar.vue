<template>
  <q-bar class="bg-dark text-white shadow-2">
    <q-toolbar-title class="text-bold">Files</q-toolbar-title>
    <q-space />
    <div class="q-gutter-xs">
      <span v-if="filesStore.selected">
        <q-btn class="gt-xs" size="10px" flat dense round icon="delete" @click="showDeleteFileDialog(filesStore.selected.name)">
          <q-tooltip>Delete {{filesStore.selected.name}}</q-tooltip>
        </q-btn>
      </span>
      <q-btn class="gt-xs" size="10px" flat dense round icon="add" @click="newFileClicked">
        <q-tooltip>New scilla file</q-tooltip>
      </q-btn>
      <q-btn @click="selectFile" class="gt-xs" size="10px" flat dense round icon="file_download">
        <q-tooltip>Open scilla file</q-tooltip>
          <q-file
            ref="fileRef"
            v-model="fileModel"
            style="display: none"
            v-bind:max-files="1"
            v-on:update:model-value="fileSelected"
          />
      </q-btn>
    </div>
  </q-bar>
</template>

<script setup lang="ts">
import { useQuasar, QFile } from 'quasar';
import { useFilesStore } from 'src/stores/files';
import { ref, Ref } from 'vue';
import { readFileAsText } from 'src/utils';

const q = useQuasar();
const fileModel = ref<File>()
const fileRef = ref() as Ref<QFile>
const filesStore = useFilesStore();

const selectFile = () => {
  fileRef.value.pickFiles()
}

const fileSelected = async (file: File) => {
  const content = await readFileAsText(file)
  filesStore.addNew(file.name, content.toString());
  console.log(file)
}

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

const showDeleteFileDialog = (filename: string) => {
  q.dialog({
    title: 'Confirm',
    message: `Are you sure to delete ${filename}?`,
    cancel: true,
  }).onOk(() => {
    try {
      filesStore.delete(filename);
      q.notify({
        message: `${filename} delete successfully.`,
        type: 'info'
      })
    } catch (error) {
      q.notify({
        message: `${filename} failed to delete. ${error}`,
        type: 'negative'
      })
    }
  })
}
</script>
