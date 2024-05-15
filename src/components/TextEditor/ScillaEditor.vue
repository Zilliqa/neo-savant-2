<template>
  <q-bar class="bg-grey-2 text-grey-8 shadow-1">
    <q-btn
      dense
      flat
      no-caps
      color="green"
      label="Deploy"
      icon="ios_share"
      @click="deployContract"
    >
      <user-network-not-selected />
    </q-btn>
    <q-btn
      dense
      flat
      label="Save"
      no-caps
      icon="save"
      :disable="!codeChanged"
      @click="saveCode"
    />
    <q-btn
      dense
      flat
      label="Find/Replace"
      no-caps
      icon="search"
      @click="toggleSearchPanel"
    />
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
  <code-mirror
    ref="cm"
    v-model="code"
    :extensions="linterIsEnabled ? [...extensions, scillaLinter] : extensions"
  />
</template>

<script setup lang="ts">
import DeployContractDialog from 'components/contracts/DeployContractDialog.vue';
import CodeMirror from 'vue-codemirror6';
import { EditorView } from '@codemirror/view';
import {
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { bracketMatching, foldGutter, foldKeymap } from '@codemirror/language';
import {
  lintKeymap,
  linter,
  Diagnostic,
  lintGutter,
  openLintPanel,
  closeLintPanel,
  forceLinting,
} from '@codemirror/lint';
import {
  highlightSelectionMatches,
  searchKeymap,
  openSearchPanel,
  closeSearchPanel,
} from '@codemirror/search';
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
} from '@codemirror/view';

import { onMounted, ref, Ref } from 'vue';
import {
  scillaCheck,
  Warning as CheckerWarning,
  Error as CheckerError,
} from 'src/scilla';
import { useQuasar } from 'quasar';
import { useFilesStore } from 'src/stores/files';

const cm: Ref<InstanceType<typeof CodeMirror> | undefined> = ref();
const props = defineProps(['contract'])
const code = ref('')
let _toggleSearchPanel = false;
const linterIsEnabled = ref(true);
const q = useQuasar();
const codeChanged = ref(false);
const EnableDisableLinter = ref(true);
const showHideHints = ref(false);

let editorView: EditorView;

onMounted(() => {
  editorView = cm.value.view
  if (props.contract) {
    code.value = props.contract.code
  }
})

const toggleSearchPanel = () => {
  _toggleSearchPanel = !_toggleSearchPanel;
  if (_toggleSearchPanel) {
    openSearchPanel(editorView);
  } else {
    closeSearchPanel(editorView);
  }
};

const toggleLintPanel = (toggle: boolean) => {
  if (toggle) {
    openLintPanel(editorView);
  } else {
    closeLintPanel(editorView);
  }
};

const setLinterEnabled = (enabled: boolean) => {
  linterIsEnabled.value = enabled;
  if (enabled) {
    forceLinting(editorView);
  }
};

const scillaLinter = linter(async (view): Promise<Diagnostic[]> => {
  if (code.value === '' || code.value === undefined) {
    return [];
  }

  let response = await scillaCheck(code.value);
  let diagnostics: Diagnostic[] = [];
  if (response.warnings) {
    response.warnings.forEach((err: CheckerWarning) => {
      diagnostics.push({
        from:
          view.state.doc.line(err.start_location.line).from +
          err.start_location.column -
          1,
        to:
          view.state.doc.line(err.start_location.line).from +
          err.start_location.column +
          1,
        severity: 'warning',
        message: err.warning_message,
      });
    });
  }

  if (response.errors) {
    response.errors.forEach((err: CheckerError) => {
      diagnostics.push({
        from: view.state.doc.line(err.line).from + err.column - 1,
        to: view.state.doc.line(err.line).from + err.column + 1,
        severity: 'error',
        message: err.msg,
      });
    });
  }

  return diagnostics;
});

const extensions = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  bracketMatching(),
  closeBrackets(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  lintGutter(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap,
  ]),
];

const deployContract = () => {
  q.dialog({
    component: DeployContractDialog,
    componentProps: { file: props.contract.file, code: code.value },
  });
};

const saveCode = () => {
  try {
    const filesStore = useFilesStore();
    filesStore.updateFileCode(props.contract.file, code.value);
    codeChanged.value = false;
    q.notify({
      type: 'info',
      message: `${props.contract.file} saved.`,
    });
  } catch (error) {
    q.notify({
      type: 'warning',
      message: `Failed to save ${props.contract.file}. ${error}`,
    });
  }
};
</script>
