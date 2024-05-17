<template>
  <q-card style="min-width: 500px" flat>
    <q-card-section>
      <div class="text-h6">
        <span class="text-weight-bolder">{{ props.contract.name }}</span>
        <span class="text-grey-7"> Transition Call</span>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="text-subtitle1 text-grey-7">Transaction Parameters</div>
      <div class="column">
        <div class="row q-gutter-sm">
          <q-input
            dense
            filled
            class="col"
            label="Amount"
            type="number"
            v-model="amount"
          />
          <gas-price-input v-model="gasPrice" />
          <q-input
            dense
            filled
            class="col"
            label="Gas Limit"
            type="number"
            v-model="gasLimit"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="text-subtitle1 text-grey-7">Transition</div>
      <div v-if="transitions.length === 0">
        <q-skeleton type="text" class="text-subtitle1" />
        <q-skeleton type="text" class="text-caption" />
      </div>
      <q-select
        @update:model-value="transitionChanged"
        v-else
        outlined
        dense
        v-model="selectedTransition"
        :options="transitions"
        label="Filled"
      />
      <!-- <q-option-group
        v-else
        v-model="selectedTransition"
        :options="transitions"
        color="primary"
        dense
        inline
        @update:model-value="transitionChanged"
      /> -->
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="text-subtitle1 text-grey-7">Transition Parameters</div>
      <div v-if="selectedParams.length > 0">
        <div
          v-for="param in selectedParams"
          :key="param.vname"
          class="q-mt-sm column q-gutter-sm"
        >
          <JsonEditorVue
            mode="text"
            :mainMenuBar="false"
            :navigationBar="false"
            :statusBar="false"
            v-if="isAdt(param.type)"
            v-model="transitionsParameters[param.vname]"
          />
          <q-input
            v-else
            dense
            filled
            :type="scillaTypeToHtmlInputType(param.type)"
            :hint="param.type"
            :label="param.vname"
            class="col"
            v-model="transitionsParameters[param.vname]"
          />
        </div>
        {{ selectedParams.params }}
      </div>
      <div v-else-if="selectedTransition !== null" class="text-grey-5 q-mt-sm">
        <strong>{{ selectedTransition.value.vname }}</strong> does not need any
        parameters
      </div>
    </q-card-section>
    <q-card-actions class="bg-grey-2">
      <q-btn
        no-caps
        flat
        color="primary"
        @click="callTransition"
        :loading="loading"
        >Call Transition</q-btn
      >
    </q-card-actions>
  </q-card>
</template>

<script setup>
import JsonEditorVue from 'json-editor-vue';
import { useQuasar } from 'quasar';
import { getContractAbi } from 'src/scilla';
import { useBlockchainStore } from 'src/stores/blockchain';
import { useContractsStore } from 'src/stores/contracts';
import { ref, onMounted, computed } from 'vue';
import { BN, Long } from '@zilliqa-js/util';
import GasPriceInput from 'src/components/GasPriceInput.vue';
import { isAdt } from 'src/utils';

const transitionsParameters = ref({});
const loading = ref(false);
let contractCode = '';
const props = defineProps(['contract']);
const q = useQuasar();
const selectedTransition = ref(null);
const transitions = ref([]);
const transitions2 = {};
const amount = ref(0);
const gasPrice = ref(0);
const gasLimit = ref(30000);

const scillaTypeToHtmlInputType = (type) => {
  if (type.startsWith('Int') || type.startsWith('Uint')) {
    return 'number';
  } else if (type === 'String' || type === 'ByStr20' || type === 'BNum') {
    return 'text';
  } else if (
    type.startsWith('Option') ||
    type.startsWith('Bool') ||
    type.startsWith('Pair') ||
    type.startsWith('List')
  ) {
    return 'textarea';
  }

  console.error(`Failed to map ${type} to html type. text returned`);
  return 'text';
};

const selectedParams = computed(() => {
  if (selectedTransition.value === null) {
    return [];
  }
  return transitions2[selectedTransition.value.value.vname].params;
});

onMounted(async () => {
  try {
    const blockchainStore = useBlockchainStore();
    contractCode = await blockchainStore.getSmartContractCode(
      props.contract.address
    );
    const abi = await getContractAbi(contractCode);
    transitions.value = abi.transitions.map((t) => {
      if (selectedTransition.value === null) {
        selectedTransition.value = {
          value: t,
          label: `${t.vname} (${t.params.map(param => `${param.vname}: ${param.type}`).join(',')})`
        }
      }
      transitions2[t.vname] = t;
      return {
        value: t,
        label: `${t.vname} (${t.params.map(param => `${param.vname}: ${param.type}`).join(',')})`
      };
    });
  } catch (error) {
    q.notify({
      type: 'negative',
      message: `Failed to get the contract ABI. Error: ${error}`,
    });
  }
});

const callTransition = async () => {
  const contractsStore = useContractsStore();
  const transitionName = selectedTransition.value.vname;
  if (transitionName === '') {
    q.notify({
      type: 'negative',
      message: 'Not possible to call an empty transition',
    });
    return;
  }

  const params = transitions2[transitionName].params.map((param) => {
    return {
      ...param,
      value: isAdt(param.type)
        ? JSON.parse(transitionsParameters.value[param.vname])
        : transitionsParameters.value[param.vname],
    };
  });

  loading.value = true;
  try {
    const txHash = await contractsStore.callTransition(
      props.contract.address,
      transitionName,
      {
        gasPrice: new BN(gasPrice.value),
        gasLimit: Long.fromNumber(gasLimit.value),
        amount: new BN(amount.value),
      },
      params
    );

    q.notify({
      type: 'info',
      message: `Transition ${transitionName} called successfully. ${txHash}`,
    });
  } catch (error) {
    q.notify({
      type: 'negative',
      message: `Failed to call transition, ${error}`,
    });
  } finally {
    loading.value = false;
  }
};

const transitionChanged = ({value}) => {
  transitionsParameters.value = {};
  transitions2[value.vname].params.forEach((param) => {
    if (param.type.startsWith('List')) {
      transitionsParameters.value[param.vname] = [];
    } else if (param.type.startsWith('Bool')) {
      transitionsParameters.value[param.vname] = {
        constructor: 'False',
        argtypes: [],
        arguments: [],
      };
    } else if (param.type.startsWith('Pair')) {
      transitionsParameters.value[param.vname] = {
        constructor: 'Pair',
        argtypes: ['', ''],
        arguments: ['', ''],
      };
    } else if (param.type.startsWith('Option')) {
      transitionsParameters.value[param.vname] = {
        constructor: 'None',
        argtypes: [''],
        arguments: [],
      };
    } else {
      transitionsParameters.value[param.vname] = '';
    }
  });
};
</script>
