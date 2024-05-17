<template>
  <q-btn
    size="12px"
    :loading="loading"
    flat
    dense
    round
    icon="refresh"
    @click="refreshTransactionStatus()"
  >
    <q-badge v-if="errorMessage" color="red" transparent floating>
      !
      <q-tooltip>{{ errorMessage }}</q-tooltip>
    </q-badge>
    <q-tooltip v-else>Refresh status</q-tooltip>
  </q-btn>
</template>

<script setup>
import { ref } from 'vue';
import { useTransactionsStore } from 'src/stores/transactions';
const props = defineProps(['txHash']);
const store = useTransactionsStore();
const loading = ref(false);
const errorMessage = ref(null);

const refreshTransactionStatus = async () => {
  loading.value = true;
  errorMessage.value = null;
  try {
    await store.refreshTransactionStatus(props.txHash);
  } catch (error) {
    errorMessage.value = error;
  } finally {
    loading.value = false;
  }
};
</script>
