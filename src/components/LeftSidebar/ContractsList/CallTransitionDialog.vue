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
      <q-option-group
        v-else
        v-model="selectedTransition"
        :options="transitions"
        color="primary"
        dense
        inline
        @update:model-value="transitionChanged"
      />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="text-subtitle1 text-grey-7">Transition Parameters</div>
      <div v-if="selectedParams.length > 0">
        <div
          v-for="param in selectedParams"
          :key="param.vname"
          class="q-mt-sm column q-gutter-sm"
        >
          <q-input dense filled :label="param.vname" class="col" v-model="transitionsParameters[param.vname]"/>
        </div>
        {{ selectedParams.params }}
      </div>
      <div v-else-if="selectedTransition !== ''" class="text-grey-5 q-mt-sm">
        <strong>{{ selectedTransition.vname }}</strong> does not need any
        parameters
      </div>
    </q-card-section>
    <q-card-actions class="bg-grey-2">
      <q-btn no-caps flat color="primary" @click="callTransition" :loading="loading"
        >Call Transition</q-btn
      >
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { getContractAbi } from 'src/scilla';
import { useBlockchainStore } from 'src/stores/blockchain';
import { useContractsStore } from 'src/stores/contracts';
import { ref, onMounted, computed } from 'vue';
import { BN, Long} from '@zilliqa-js/util';
import GasPriceInput from 'src/components/GasPriceInput.vue';

const transitionsParameters = ref({})
const loading = ref(false);
let contractCode = '';
const props = defineProps(['contract']);
const q = useQuasar();
const selectedTransition = ref('');
const show = ref(true);
const transitions = ref([]);
const transitions2 = {};
const amount = ref(0);
const gasPrice = ref(0);
const gasLimit = ref(30000);

const selectedParams = computed(() => {
  if (selectedTransition.value === '') {
    return [];
  }
  return transitions2[selectedTransition.value.vname].params;
});

onMounted(async () => {
  try {
    const blockchainStore = useBlockchainStore();
    contractCode = await blockchainStore.getSmartContractCode(
      props.contract.address
    );
    const abi = await getContractAbi(contractCode);
    transitions.value = abi.transitions.map((t) => {
      if (selectedTransition.value === '') {
        selectedTransition.value = t;
      }
      transitions2[t.vname] = t;
      return {
        label: t.vname,
        value: t,
      };
    });
  } catch (error) {
    show.value = false;
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
      message: 'Not possible to call an empty transition'
    })
    return;
  }

  const params = transitions2[transitionName].params.map(param => {
    return {
      ...param,
      value: transitionsParameters.value[param.vname]
    }
  });

  loading.value = true;
  try {
    const txHash = await contractsStore.callTransition(props.contract.address, transitionName, {
        gasPrice: new BN(gasPrice.value),
        gasLimit: Long.fromNumber(gasLimit.value),
        amount: new BN(amount.value),
      }, params)

      q.notify({
        type: 'info',
        message: `Transition ${transitionName} called successfully. ${txHash}`
      })
  } catch (error) {
    q.notify({
      type: 'negative',
      message: `Failed to call transition, ${error}`
    })
  } finally {
    loading.value = false;
  }
}

const transitionChanged = (value) => {
  console.log('value', transitions2[value.vname])
  transitionsParameters.value = {}
  transitions2[value.vname].params.forEach(param => transitionsParameters.value[param.vname] = '')
}

</script>
