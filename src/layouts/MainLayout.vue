<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <top-bar></top-bar>
      <menu-bar></menu-bar>
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
import TopBar from 'src/components/header/TopBar/TopBar.vue';
import MenuBar from 'src/components/header/MenuBar/MenuBar.vue';

const leftDrawerOpen = ref(false);
</script>
