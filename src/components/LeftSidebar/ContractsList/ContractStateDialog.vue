<template>
  <q-card style="width: 500px; max-width: 80vw" flat>
    <q-card-section>
      <div class="text-h6">
        <span class="text-weight-bolder">{{ props.contract.name }}</span>
        <span class="text-grey-7"> State</span>
      </div>
      <div class="q-gutter-sm">
        <q-radio v-model="mode" val="state" label="State" />
        <q-radio v-model="mode" val="sub-state" label="Sub-State" />
      </div>

    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row q-gutter-sm q-mb-sm" v-if="mode ==='sub-state'">
        <q-input dense outlined v-model="variableName" label="Variable Name" class="col" />
        <q-input dense outlined v-model="indices" label="Indices (Optional)" hint="Separate with comma" class="col"/>
      </div>
      <div class="row q-gutter-sm q-mb-sm">
        <q-space/>
      </div>
      <q-skeleton v-if="loading" type="QInput"  style="height: 300px;"/>
      <q-scroll-area v-else-if="data" style="height: 300px;" class="row">
        <vue-json-pretty :data="data"/>
      </q-scroll-area>
    </q-card-section>
    <q-separator />
    <q-card-actions align="right" class="bg-grey-2">
      <q-btn
        @click="fetch"
        icon="download"
        no-caps
        flat
        color="primary"
        >Fetch</q-btn
      >
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { useBlockchainStore } from 'src/stores/blockchain';
import { useQuasar } from 'quasar';

const data = ref(null)
const q = useQuasar();
const props = defineProps(['contract']);
const loading = ref(false);
const mode = ref('state');
const variableName = ref('')
const indices = ref(undefined);

const fetch = async() => {
  if (mode.value === 'state') {
    return fetchState()
  } else if (mode.value === 'sub-state') {
    return fetchSubState()
  }
}

const fetchState = async() => {
  try {
    loading.value = true;
    const blockchainStore = useBlockchainStore();
    data.value = await blockchainStore.getSmartContractState(props.contract.address)
  } catch (error) {
    q.notify({
      type: 'negative',
      message: `Failed to get the state. ${error.message}`
    })
  } finally {
    loading.value = false;
  }
}

const fetchSubState = async() => {
  try {
    loading.value = true;
    const blockchainStore = useBlockchainStore();

    data.value = await blockchainStore.getSmartContractSubState(props.contract.address, variableName.value,
        indices.value === undefined ? undefined : indices.value.split(','))
  } catch (error) {
    q.notify({
      type: 'negative',
      message: `Failed to get the sub-state. ${error.message}`
    })
  } finally {
    loading.value = false;
  }

}
</script>
