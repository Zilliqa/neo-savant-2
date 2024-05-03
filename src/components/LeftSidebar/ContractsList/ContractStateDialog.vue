<template>
  <q-dialog
    v-model="show"
    :persistent="false"
    :no-esc-dismiss="false"
    backdrop-filter="blur(4px)"
  >
    <q-card style="width: 500px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Contract State</div>
        <truncated-text class="text-grey-7 q-m" :text="props.txHash" :length="50" :position="25"/>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-skeleton v-if="contractState === null" type="QInput" />
        <vue-json-pretty v-else :data="contractState" />
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
import TruncatedText from 'components/TruncatedText.vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { useBlockchainStore } from 'src/stores/blockchain';
import { useQuasar } from 'quasar';

const contractState = ref(null)
const q = useQuasar();
const props = defineProps(['address']);

onMounted(async() => {
  try {
    const blockchainStore = useBlockchainStore();
    contractState.value = await blockchainStore.getSmartContractState(props.address)
  } catch (error) {
    q.notify({
      type: 'negative',
      message: `Failed to get the receipt. ${error.message}`
    })
  }
})
</script>
