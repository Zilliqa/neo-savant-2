<template>
  <div class="q-pa-sm q-gutter-sm row items-center">
    <div class="text-bold text-uppercase col"> Managed by zilpay </div>
    <q-btn color="primary" @click="disconnectClicked" v-close-popup>Disconnect</q-btn>
  </div>
</template>

<script setup>
import { zilpayHelper } from 'src/utils';

const disconnectClicked = () => {
  zilpayHelper.disconnect();
}

</script>
