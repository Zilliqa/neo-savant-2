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
      >
        <user-network-not-selected />
      </q-btn>
    </q-bar>
    <q-tabs
      v-model="tab"
      dense
      class="bg-grey-2 shadow-1"
      active-color="orange"
      active-bg-color="grey-4"
      indicator-color="orange"
      align="left"
      no-caps
    >
      <q-tab v-for="file in filesStore.openFiles" :name="file" :key="file">
        <div class="row items-center">
          {{ file }}
          <q-btn round dense flat icon="close" size="xs" class="q-ml-sm" @click="closeFile(file)"/>
        </div>
      </q-tab>
    </q-tabs>
    <div v-show="tab === file" class="col row" v-for="file in filesStore.openFiles" :name="file" :key="file">
      <q-scroll-area class="col">
        <editor-tab :file-name="file"/>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useFilesStore } from 'src/stores/files';
import {ref} from 'vue';
import UserNetworkNotSelected from 'components/UserNetworkNotSelectedAlarm.vue';
import EditorTab from './editor/EditorTab.vue';
// import DeployContractDialog from 'components/contracts/DeployContractDialog.vue';
const tab = ref('');
const filesStore = useFilesStore();

defineOptions({
  name: 'EditorPage',
});

const deployContract = () => {
  // q.dialog({
  //   component: DeployContractDialog,
  //   componentProps: { file: contractFile.value, code: code.value },
  // });
};

const closeFile = (file: string) => {
  filesStore.removeFromOpenFiles(file);
  console.log(filesStore.openFiles[0])
  tab.value = filesStore.openFiles[0];
  console.log(tab.value);
}

</script>
