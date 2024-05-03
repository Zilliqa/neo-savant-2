<template>
  <q-input
    dense
    filled
    label="Gas Price"
    type="number"
    v-model="model"
  />
</template>

<script setup>
import { defineModel, onMounted } from 'vue';
import { useBlockchainStore } from 'src/stores/blockchain';
import { useQuasar } from 'quasar';

const model = defineModel();
const q = useQuasar();

onMounted(async () => {
  const blockchainStore = useBlockchainStore()
  try {
    const price = (await blockchainStore.minimumGasPrice) || '0';
    model.value = parseInt(price);
  } catch (error) {
    q.notify({
      type: 'warning',
      message: 'Failed to get the minimum gas price, 0 is set.' + error
    })
    model.value = 0;
  }
});
</script>
