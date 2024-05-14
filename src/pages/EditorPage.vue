<template>
  <q-page class="column">
    <q-bar class="bg-grey-1 text-grey-8 q-pa-sm">
      <q-btn
        dense
        flat
        no-caps
        color="green"
        label="Deploy"
        icon="ios_share"
        @click="deployContract"
        :disable="contractFile == ''"
      >
        <user-network-not-selected />
      </q-btn>
      <q-separator class="q-ml-xs" vertical />
      <q-btn
        dense
        flat
        label="Save"
        no-caps
        icon="save"
        :disable="!codeChanged"
        @click="saveCode"
      />
      <q-separator class="q-ml-xs" vertical />
      <q-btn
        dense
        flat
        label="Find/Replace"
        no-caps
        icon="search"
        @click="toggleSearchPanel"
      />
      <q-separator class="q-ml-xs" vertical />
      <q-btn-dropdown flat dense no-caps icon="check" label="Linter">
        <div class="column no-wrap q-pa-sm q-gutter-sm">
          <q-toggle
            v-model="EnableDisableLinter"
            color="dark"
            dense
            @update:model-value="setLinterEnabled"
            :label="EnableDisableLinter ? 'Disable Linter' : 'Enable Linter'"
          />
          <q-toggle
            v-model="showHideHints"
            @update:model-value="toggleLintPanel"
            color="dark"
            dense
            label="Show/Hide Hints"
          />
        </div>
      </q-btn-dropdown>
    </q-bar>

    <div class="col row">
      <q-scroll-area class="col">
        <scilla-editor
          v-model="code"
          ref="editor"
          @change="codeChanged = true"
        />
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import DeployContractDialog from 'components/contracts/DeployContractDialog.vue';
import UserNetworkNotSelected from 'components/UserNetworkNotSelectedAlarm.vue';
import ScillaEditor from 'components/TextEditor/ScillaEditor.vue';

import { ref, onMounted } from 'vue';
import { eventBus } from 'src/event-bus';
import { useQuasar } from 'quasar';
import { ScillaContract } from 'src/utils';
import { useFilesStore } from 'src/stores/files';

const code = ref('');
const contractFile = ref('');
const editor = ref<InstanceType<typeof ScillaEditor>>();
const q = useQuasar();
const codeChanged = ref(false);
const EnableDisableLinter = ref(true);
const showHideHints = ref(false);

onMounted(() => {
  eventBus.on('contract-selected', (contract: ScillaContract) => {
    contractFile.value = contract.name;
    code.value = contract.code;
  });
});

defineOptions({
  name: 'EditorPage',
});

const toggleSearchPanel = () => {
  if (editor.value) {
    editor.value.toggleSearchPanel();
  }
};

const toggleLintPanel = (t: boolean) => {
  if (editor.value) {
    editor.value.toggleLintPanel(t);
  }
};

const setLinterEnabled = (t: boolean) => {
  if (editor.value) {
    editor.value.setLinterEnabled(t);
  }
};

const deployContract = () => {
  q.dialog({
    component: DeployContractDialog,
    componentProps: { file: contractFile.value, code: code.value },
  });
};

const saveCode = () => {
  try {
    const filesStore = useFilesStore();
    filesStore.updateFileCode(contractFile.value, code.value);
    codeChanged.value = false;
    q.notify({
      type: 'info',
      message: `${contractFile.value} saved.`,
    });
  } catch (error) {
    q.notify({
      type: 'warning',
      message: `Failed to save ${contractFile.value}. ${error}`,
    });
  }
};
</script>
