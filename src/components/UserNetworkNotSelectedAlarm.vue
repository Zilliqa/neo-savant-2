<template>
  <q-badge
    v-if="blockchainStore.selectedAccount === null || blockchainStore.selectedNetwork === null"
    color="red"
    floating
  >
    !
    <q-tooltip>Network and/or Account not selected!</q-tooltip>
  </q-badge>
</template>

<script setup>
import { useBlockchainStore } from 'src/stores/blockchain';

const blockchainStore = useBlockchainStore();
</script>
