<template>
  <q-item clickable @click="openDetails">
    <q-item-section>
      <q-item-label class="row items-center justify-between">
        <div class="text-bold q-mr-sm">{{ props.contract.name }}</div>
        <contract-list-item-actions :contract="props.contract" />
      </q-item-label>
      <q-item-label caption>
        <div class="row items-center">
          <truncated-text
            :text="props.contract.address"
            :length="24"
            :position="12"
            :link="
              blockchainStore.getExplorerLinkForContract(props.contract.address)
            "
          />
          <copy-to-clipboard-btn :content="props.contract.address" />
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import ContractListItemActions from './ContractListItemActions.vue';
import TruncatedText from 'components/TruncatedText.vue';
import CopyToClipboardBtn from 'components/CopyToClipboardBtn.vue';
import { useBlockchainStore } from 'src/stores/blockchain';
import { useContractsStore } from 'src/stores/contracts';

const contractsStore = useContractsStore();
const props = defineProps(['contract']);
const blockchainStore = useBlockchainStore();

const openDetails = () => {
  contractsStore.setSelected(props.contract.name);
};
</script>
