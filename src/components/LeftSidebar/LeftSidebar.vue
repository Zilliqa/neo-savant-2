<template lang="">
  <div class="column full-height">
    <files-title-bar/>
    <q-scroll-area class="col">
      <file-selector />
    </q-scroll-area>
    <contracts-title-bar/>
    <q-scroll-area class="col">
      <contract-list />
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import ContractList from 'components/LeftSidebar/ContractList.vue';
import FileSelector from 'components/LeftSidebar/FileSelector.vue';
import ContractsTitleBar from 'components/LeftSidebar/ContractsList/ContractsTitleBar.vue';
import FilesTitleBar from 'components/LeftSidebar/FilesList/FilesTitleBar.vue';
</script>

