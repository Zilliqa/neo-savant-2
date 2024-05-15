<template>
  <q-item clickable @click="openDetails">
    <q-item-section>
      <q-item-label class="row items-center justify-between">
        <div class="text-bold q-mr-sm">{{ props.contract.name }}</div>
        <contract-list-item-actions :contract="props.contract"/>
      </q-item-label>
      <q-item-label caption>
        <div class="row items-center">
          <truncated-text
            :text="props.contract.address"
            :length="24"
            :position="12"
          />
          <copy-to-clipboard-btn :content="props.contract.address" />
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import ContractListItemActions from './ContractListItemActions.vue'
import TruncatedText from 'components/TruncatedText.vue';
import CopyToClipboardBtn from 'components/CopyToClipboardBtn.vue';
import ContractDetailsDialog from '../ContractDetailsDialog.vue';

import { useQuasar } from 'quasar';

const q = useQuasar();
const props = defineProps(['contract'])

const openDetails = () => {
  q.dialog({
    component: ContractDetailsDialog,
    componentProps: {
      contract: props.contract,
    },
  });
}
</script>
