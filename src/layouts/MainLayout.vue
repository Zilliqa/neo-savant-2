<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <menu-bar />
      <q-separator color="grey-9" />
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="leftDrawerWidth"
    >
      <left-sidebar />
      <div
        v-touch-pan.preserveCursor.prevent.mouse.horizontal="resizeLeftDrawer"
        class="q-drawer__resizer_left"
      ></div>
    </q-drawer>

    <q-drawer
      side="right"
      :width="rightDrawerWidth"
      v-model="rightDrawerOpen"
      bordered
      v-if="contractsStore.selected"
    >
      <contract-details-title-bar
        :contract-name="contractsStore.selected.name"
        @close="contractsStore.deselect()"
      />
      <contract-details-panel :contract="contractsStore.selected" />
      <div
        v-touch-pan.preserveCursor.prevent.mouse.horizontal="resizeRightDrawer"
        class="q-drawer__resizer_right"
      ></div>
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
import ContractDetailsPanel from 'src/components/RightSidebar/ContractDetailsPanel.vue';
import { useContractsStore } from 'src/stores/contracts';
import ContractDetailsTitleBar from 'src/components/RightSidebar/ContractDetailsTitleBar.vue';

const contractsStore = useContractsStore();
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(true);

let initialLeftDrawerWidth = 300;
let initialRightDrawerWidth = 300;
const leftDrawerWidth = ref(300);
const rightDrawerWidth = ref(500);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resizeLeftDrawer = (ev: any) => {
  if (ev.isFirst === true) {
    initialLeftDrawerWidth = leftDrawerWidth.value;
  }
  leftDrawerWidth.value = initialLeftDrawerWidth + ev.offset.x;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resizeRightDrawer = (ev: any) => {
  if (ev.isFirst === true) {
    initialRightDrawerWidth = rightDrawerWidth.value;
  }
  rightDrawerWidth.value = initialRightDrawerWidth - ev.offset.x;
};
</script>

<style lang="sass">
.q-drawer__resizer_left
  position: absolute
  top: 0
  bottom: 0
  right: -2px
  width: 3px
  background-color: $dark
  cursor: ew-resize

.q-drawer__resizer_right
  position: absolute
  top: 0
  bottom: 0
  left: -2px
  width: 3px
  background-color: $dark
  cursor: ew-resize
</style>
