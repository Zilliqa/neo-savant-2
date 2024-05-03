<template>
  <q-dialog v-model="show">
  <q-card style="min-width: 500px">
    <q-card-section>
      <div class="text-h6">Import Contract</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="column q-gutter-sm">
        <q-input filled dense label="Contract Name" v-model="name" autofocus/>
        <q-input filled dense label="Contract Address" v-model="address" autofocus/>
      </div>
    </q-card-section>

    <q-card-actions align="right" class="bg-grey-2">
      <q-btn no-caps flat color="primary" :loading="importLoading" @click="importContract"
        >Import</q-btn
      >
      <q-btn no-caps color="negative" flat label="Cancel" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useContractsStore } from 'src/stores/contracts';
import { ref } from 'vue';

const address = ref('')
const name = ref('')
const show = ref(true)
const q = useQuasar();
const importLoading = ref(false)

const importContract = async () => {
  const contractsStore = useContractsStore();
  importLoading.value = true;
  try {
    await contractsStore.import(name.value, address.value)
    q.notify({
      type: 'info',
      message: `Contract ${address.value} imported successfully`
    })
    show.value = false;
  } catch (error) {
    q.notify({
      type: 'negative',
      message: `Failed to import contract. ${error}`
    })
  } finally {
    importLoading.value = false;
  }
  return;
}
</script>
