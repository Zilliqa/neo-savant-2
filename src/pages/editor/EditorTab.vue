<template>
  <code-mirror v-model="code" basic/>
</template>

<script setup lang="ts">
import CodeMirror from 'vue-codemirror6';
// import { EditorState } from '@codemirror/state';
import { onMounted, ref } from 'vue';
import { useFilesStore } from 'src/stores/files';

const code = ref('');
const props = defineProps(['fileName']);

// const editorChanged = (state: EditorState) => {
//   const filesStore = useFilesStore();
//   filesStore.updateSelectedFileCode(state.doc.toString());
// }

onMounted(() => {
  const filesStore = useFilesStore();
  const file = filesStore.getByName(props.fileName)
  if (file) {
    code.value = file.code;
  }
})
</script>
