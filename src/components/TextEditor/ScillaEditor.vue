<template>
  <code-mirror
    ref="cm"
    @change="emit('change', model!)"
    v-model="model"
    :extensions="linterIsEnabled ? [...extensions, scillaLinter] : extensions"
  />
</template>

<script setup lang="ts">
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

import { onMounted, ref, defineModel, Ref } from 'vue';
import {
  scillaCheck,
  Warning as CheckerWarning,
  Error as CheckerError,
} from 'src/scilla';

const emit = defineEmits<{(e: 'change', value: string): void}>();
const cm: Ref<InstanceType<typeof CodeMirror> | undefined> = ref();
const model = defineModel({type: String});
let _toggleSearchPanel = false;
const linterIsEnabled = ref(true);

let editorView: EditorView;

onMounted(() => {
  editorView = cm.value.view
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

defineExpose({
  toggleSearchPanel,
  toggleLintPanel,
  setLinterEnabled,
});

const scillaLinter = linter(async (view): Promise<Diagnostic[]> => {
  if (model.value === '' || model.value === undefined) {
    return [];
  }

  let response = await scillaCheck(model.value);
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

</script>
