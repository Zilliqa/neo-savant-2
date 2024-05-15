<template>
  <div class="row q-gutter-xs">
    <q-btn
      color="negative"
      no-caps
      label="Delete"
      size="sm"
      dense
      flat
      icon="delete_outline"
      @click.stop="showDeleteContractDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useContractsStore } from 'src/stores/contracts';

const q = useQuasar();

const props = defineProps(['contract'])


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

</script>
