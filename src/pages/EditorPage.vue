<template>
  <q-page class="column">
    <q-scroll-area
      class="full-width"
      style="height: 38px"
      :thumb-style="thumbStyle"
    >
      <q-tabs
        v-model="tab"
        dense
        class="bg-grey-2"
        active-class="bg-grey-4"
        active-color="grey-10"
        indicator-color="orange"
        align="left"
        no-caps
        @update:model-value="updateSelectedFile"
      >
        <q-tab
          class="q-pa-none q-pl-sm"
          v-for="file in filesStore.openFiles"
          :name="file"
          :key="file"
        >
          <div class="items-center">
            {{ file }}
            <q-btn
              round
              dense
              flat
              icon="close"
              size="xs"
              class="q-ml-xs"
              @click="closeFile(file)"
            />
          </div>
        </q-tab>
      </q-tabs>
    </q-scroll-area>
    <q-separator color="grey-4" />

    <div
      v-for="file in filesStore.openFiles"
      :name="file"
      :key="file"
      v-show="tab === file"
      class="col row q-mt-xs"
    >
      <q-scroll-area class="col">
        <scilla-editor :contract="filesStore.getByName(file)" ref="editor" />
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useFilesStore } from 'src/stores/files';
import ScillaEditor from 'components/TextEditor/ScillaEditor.vue';
import { ref, onMounted } from 'vue';
import { eventBus } from 'src/event-bus';
import { ScillaFile } from 'src/utils';

const tab = ref('tab');
const filesStore = useFilesStore();
const closeFile = (file: string) => {
  filesStore.removeFromOpenFiles(file);
  tab.value = filesStore.openFiles[0];
};

const thumbStyle = {
  backgroundColor: 'grey-1',
  height: '5px',
};

onMounted(() => {
  eventBus.on('scilla-file-selected', (file: ScillaFile) => {
    tab.value = file.name;
  });

  if (filesStore.selected) {
    tab.value = filesStore.selected.name;
  }
});

const updateSelectedFile = (tab: string) => {
  filesStore.setSelected(tab);
};

defineOptions({
  name: 'EditorPage',
});
</script>
