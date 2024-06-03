<template>
  <div class="q-pa-sm q-gutter-sm row items-center">
    <div class="text-bold text-uppercase col">Managed by Ledger</div>
    <q-btn color="primary" @click="disconnectClicked" v-close-popup
      >Disconnect</q-btn
    >
  </div>
</template>

<script setup>
import { ledgerHelper } from 'src/utils';

const disconnectClicked = () => {
  ledgerHelper.disconnect();
};
</script>
