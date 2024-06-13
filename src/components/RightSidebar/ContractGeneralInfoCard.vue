<template>
  <q-card flat>
    <q-card-section>
      <div class="text-subtitle text-grey-7">{{ props.address }}</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row q-gutter-sm q-mb-sm column">
        <div class="row q-gutter-x-sm">
          <q-btn
            no-caps
            dense
            color="grey-9"
            :loading="loading && mode === 'code'"
            @click="fetchCode"
            >Contract Code</q-btn
          >
          <q-btn
            no-caps
            dense
            color="primary"
            v-if="mode === 'code'"
            @click="importCodeToIde"
            >Import Code to IDE</q-btn
          >
          <q-btn
            no-caps
            dense
            color="primary"
            :loading="loading && mode === 'init'"
            @click="fetchInit"
            >Contract Init</q-btn
          >
        </div>
        <q-skeleton v-if="loading" type="QInput" style="height: 300px" />
        <q-scroll-area v-else-if="data" style="height: 600px">
          <vue-json-pretty v-if="mode === 'init'" :data="data" />
          <code-mirror v-else-if="mode === 'code'" v-model="data" />
        </q-scroll-area>
      </div>
    </q-card-section>
    <q-separator />
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { useBlockchainStore } from 'src/stores/blockchain';
import { useQuasar } from 'quasar';
import CodeMirror from 'vue-codemirror6';
import { useFilesStore } from 'src/stores/files';

const data = ref(null);
const q = useQuasar();
const props = defineProps(['address']);
const loading = ref(false);
const blockchainStore = useBlockchainStore();
const mode = ref(null);

const fetchInit = async () => {
  try {
    mode.value = 'init';
    loading.value = true;
    data.value = await blockchainStore.getSmartContractInit(props.address);
  } catch (error) {
    mode.value = null;
    q.notify({
      type: 'negative',
      message: `Failed to get the init. ${error.message}`,
    });
  } finally {
    loading.value = false;
  }
};

const fetchCode = async () => {
  try {
    mode.value = 'code';
    loading.value = true;
    data.value = await blockchainStore.getSmartContractCode(props.address);
  } catch (error) {
    mode.value = null;
    q.notify({
      type: 'negative',
      message: `Failed to get the contract code. ${error.message}`,
    });
  } finally {
    loading.value = false;
  }
};

const importCodeToIde = () => {
  const filesStore = useFilesStore();
  q.dialog({
    title: 'Import Contract',
    message: 'Enter a name:',
    prompt: {
      model: '',
      type: 'text',
    },
    cancel: true,
    persistent: true,
  }).onOk((name) => {
    try {
      filesStore.addNew(name, data.value);
      q.notify({
        type: 'info',
        message: `The contract code imported to the IDE with the name of ${name}`,
      });
    } catch (error) {
      q.notify({
        type: 'warning',
        message: `${error}`,
      });
    }
  });
};
</script>
