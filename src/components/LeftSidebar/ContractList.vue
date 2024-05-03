<template>
  <q-list dense separator>
    <div v-for="contract in store.pending" :key="contract.txHash">
      <pending-contract-list-item :contract="contract"/>
      <q-separator />
    </div>
    <div v-for="contract in store.contracts" :key="contract.address">
      <contract-list-item :contract="contract"/>
      <q-separator />
    </div>
  </q-list>
</template>

<script setup lang="ts">
import { useContractsStore } from 'src/stores/contracts';
import { onMounted, onUnmounted } from 'vue';
import ContractListItem from 'components/LeftSidebar/ContractsList/item/ContractListItem.vue'
import PendingContractListItem from 'components/LeftSidebar/ContractsList/item/PendingContractListItem.vue'

const store = useContractsStore();
let intervalId: NodeJS.Timeout;

onMounted(() => {
  intervalId = setInterval(async () => {
    await store.refreshPendingContracts();
  }, 5000);
});

onUnmounted(() => clearInterval(intervalId));

</script>

<style lang=""></style>
