<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <menu-bar/>
      <q-separator color="grey-9"/>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="230">
      <left-sidebar />
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

const leftDrawerOpen = ref(false);
</script>
