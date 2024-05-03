<template>
  <q-btn
    size="12px"
    :loading="loading"
    flat
    dense
    round
    icon="receipt"
    @click="showTransactionReceiptDialog()"
  >
    <q-badge v-if="errorMessage" color="red" transparent floating>
      !
      <q-tooltip>{{ errorMessage }}</q-tooltip>
    </q-badge>
    <q-tooltip>Receipt</q-tooltip>
  </q-btn>
</template>

<script setup>
import { useQuasar } from 'quasar';
import TransactionReceiptDialog from 'components/TransactionReceiptDialog.vue';

const props = defineProps(['txHash']);
const q = useQuasar();

const showTransactionReceiptDialog = () => {
  q.dialog({
    component: TransactionReceiptDialog,
    componentProps: { txHash: props.txHash },
  });

}

</script>
