<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <menu-bar/>
      <q-separator color="grey-9"/>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <left-sidebar />
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered :width="600">
      <contract-details v-if="contractsStore.selected" :contract="contractsStore.selected" class="fit"/>
    </q-drawer>


    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import LeftSidebar from 'components/LeftSidebar/LeftSidebar.vue';
import MenuBar from 'src/components/header/MenuBar/MenuBar.vue';
import { useContractsStore } from 'src/stores/contracts';
import ContractDetails from 'components/LeftSidebar/ContractsList/ContractDetails.vue';

const contractsStore = useContractsStore();

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
</script>
