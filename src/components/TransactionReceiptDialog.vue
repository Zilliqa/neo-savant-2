<template>
  <q-dialog
    v-model="show"
    :persistent="false"
    :no-esc-dismiss="false"
    backdrop-filter="blur(4px)"
  >
    <q-card style="width: 500px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Transaction Receipt</div>
        <truncated-text class="text-grey-7 q-m" :text="props.txHash" :length="50" :position="25"/>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-skeleton v-if="receiptJson === null" type="QInput" />
        <vue-json-pretty v-else :data="receiptJson" />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="bg-grey-2">
        <q-btn
          icon="close"
          no-caps
          flat
          color="negative"
          v-close-popup
          >Close</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import TruncatedText from './TruncatedText.vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { useBlockchainStore } from 'src/stores/blockchain';
import { useQuasar } from 'quasar';

const receiptJson = ref(null)
const q = useQuasar();
const props = defineProps(['txHash']);

onMounted(async() => {
  try {
    const blockchainStore = useBlockchainStore();
    receiptJson.value = await blockchainStore.getTransactionReceipt(props.txHash)
  } catch (error) {
    q.notify({
      type: 'negative',
      message: `Failed to get the receipt. ${error}`
    })
  }
})
</script>
