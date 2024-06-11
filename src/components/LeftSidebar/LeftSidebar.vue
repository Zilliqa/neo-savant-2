<template lang="">
  <q-splitter horizontal v-model="splitterModel" class="column full-height">
    <template v-slot:before>
      <q-scroll-area class="fit">
        <files-title-bar />
        <file-selector />
      </q-scroll-area>
    </template>
    <template v-slot:after>
      <contracts-title-bar />
      <contract-list />
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import ContractList from 'components/LeftSidebar/ContractList.vue';
import FileSelector from 'components/LeftSidebar/FileSelector.vue';
import ContractsTitleBar from 'components/LeftSidebar/ContractsList/ContractsTitleBar.vue';
import FilesTitleBar from 'components/LeftSidebar/FilesList/FilesTitleBar.vue';
import { ref } from 'vue';

const splitterModel = ref(50);
</script>
