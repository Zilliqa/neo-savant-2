<template>
  <q-list dense separator>
    <div v-for="contract in store.pending" :key="contract.txHash">
      <pending-contract-list-item :contract="contract"/>
      <q-separator />
    </div>
    <template v-if="blockchainStore.selectedNetwork">
      <div v-for="contract in store.contractsForNetwork(blockchainStore.selectedNetwork.name)" :key="contract.address">
        <contract-list-item :contract="contract"/>
        <q-separator />
      </div>
    </template>
    <div v-else class="text-grey-5 q-ma-sm">No network selected</div>
  </q-list>
</template>

<script setup lang="ts">
import { useContractsStore } from 'src/stores/contracts';
import { onMounted, onUnmounted } from 'vue';
import ContractListItem from 'components/LeftSidebar/ContractsList/item/ContractListItem.vue'
import PendingContractListItem from 'components/LeftSidebar/ContractsList/item/PendingContractListItem.vue'
import { useBlockchainStore } from 'src/stores/blockchain';

const store = useContractsStore();
const blockchainStore = useBlockchainStore();
let intervalId: NodeJS.Timeout;

onMounted(() => {
  intervalId = setInterval(async () => {
    await store.refreshPendingContracts();
  }, 5000);
});

onUnmounted(() => clearInterval(intervalId));

</script>

<style lang=""></style>
