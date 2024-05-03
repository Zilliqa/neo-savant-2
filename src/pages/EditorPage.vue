<template>
  <q-page class="column">
    <q-bar class="bg-grey-1 text-grey-8 q-pt-sm">
      <q-btn dense flat label="Save" no-caps icon="save" disabled />
      <q-separator vertical inset />
      <!-- <q-btn
        dense
        flat
        label="Find/Replace"
        no-caps
        icon="search"
        @click="toggleSearchPanel"
      />
      <q-separator vertical inset />
      <q-btn
        dense
        flat
        label="Code Lints"
        no-caps
        icon="healing"
        @click="toggleLintPanel"
      /> -->
      <q-space />
      <q-btn
        dense
        flat
        label="Deploy"
        icon="send"
        @click="deployContract"
        :disable="contractFile == ''"
      >
        <user-network-not-selected />
      </q-btn>
    </q-bar>

    <div class="col row">
      <q-scroll-area class="col">
        <code-mirror @change="editorChanged" v-model="code" basic/>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import DeployContractDialog from 'components/contracts/DeployContractDialog.vue';
import UserNetworkNotSelected from 'components/UserNetworkNotSelectedAlarm.vue';
import CodeMirror from 'vue-codemirror6';

import { ref, onMounted } from 'vue';
import { eventBus } from 'src/event-bus';
import { useQuasar } from 'quasar';
import { ScillaContract } from 'src/utils';
import { EditorState } from '@codemirror/state';
import { useFilesStore } from 'src/stores/files';

const code = ref('');
const contractFile = ref('');
// const editor = ref<InstanceType<typeof ScillaEditor>>();
const q = useQuasar();

onMounted(() => {
  eventBus.on('contract-selected', (contract: ScillaContract) => {
    code.value = contract.code;
    contractFile.value = contract.name;
  });
});

defineOptions({
  name: 'EditorPage',
});

// const toggleSearchPanel = () => {
//   return;
//   // if (editor.value) {
//   //   editor.value.toggleSearchPanel();
//   // }
// };

// const toggleLintPanel = () => {
//   return;
//   // if (editor.value) {
//   //   editor.value.toggleLintPanel();
//   // }
// };

const deployContract = () => {
  q.dialog({
    component: DeployContractDialog,
    componentProps: { file: contractFile.value, code: code.value },
  });
};

const editorChanged = (state: EditorState) => {
  const filesStore = useFilesStore();
  filesStore.updateSelectedFileCode(state.doc.toString());
}
</script>
