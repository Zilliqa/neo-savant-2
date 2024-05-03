<template>
  <div class="row q-gutter-xs">
    <q-btn
      color="primary"
      no-caps
      label="Call Transition"
      size="sm"
      dense
      @click="showContractDetailsDialog(props.contract)"
    />
    <q-btn
      color="secondary"
      no-caps
      label="Get State"
      size="sm"
      dense
      @click="showContractStateDialog()"
    />
    <q-btn
      color="negative"
      no-caps
      label="Delete"
      size="sm"
      dense
      @click="showDeleteContractDialog"
    />
  </div>
</template>

<script setup lang="ts">
import CallTransitionDialog from '../CallTransitionDialog.vue';
import ContractStateDialog from '../ContractStateDialog.vue';
import { Contract } from 'src/utils';
import { useQuasar } from 'quasar';
import { useContractsStore } from 'src/stores/contracts';

const q = useQuasar();

const props = defineProps(['contract'])

const showContractDetailsDialog = (contract: Contract) => {
  q.dialog({
    component: CallTransitionDialog,
    componentProps: {
      contract,
    },
  });
};

const showDeleteContractDialog = () => {
  q.dialog({
    title: 'Confirm',
    message: `Are you sure to delete ${props.contract.name}?`,
    cancel: true,
  }).onOk(() => {
    const contractsStore = useContractsStore();
    try {
      contractsStore.delete(props.contract.name);
      q.notify({
        message: `${props.contract.name} delete successfully.`,
        type: 'info'
      })
    } catch (error) {
      q.notify({
        message: `${props.contract.name} failed to delete.`,
        type: 'negative'
      })
    }
  })
}

const showContractStateDialog = () => {
  q.dialog({
    component: ContractStateDialog,
    componentProps: {
      address: props.contract.address
    }
  })
}
</script>
