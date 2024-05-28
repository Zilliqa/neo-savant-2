<template>
  <q-btn
    size="12px"
    flat
    dense
    round
    icon="receipt"
    @click="showTransactionReceiptDialog()"
  >
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
};
</script>
