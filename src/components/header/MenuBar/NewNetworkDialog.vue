<template>
  <q-dialog
    v-model="show"
    persistent="false"
    no-esc-dismiss="false"
    backdrop-filter="blur(4px)"
  >
    <q-card style="width: 500px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Add New Network</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="column q-gutter-sm">
          <q-input
            filled
            dense
            class="col"
            label="Name"
            v-model="name"
            :rules="[(val) => !!val || 'Name is required']"
          />
          <q-input
            filled
            dense
            class="col"
            label="URL"
            v-model="url"
            :rules="[(val) => !!val || 'URL is required']"
          />
          <q-input
            filled
            dense
            class="col"
            label="Chain ID"
            type="number"
            v-model="chaiId"
            :rules="[(val) => !!val || 'Chain ID is required']"
          />
          <q-input
            filled
            dense
            class="col"
            label="Faucet"
            hint="Optional. Add a {ADDRESS} to the URL. It'll be replaced with the account's address"
            v-model="faucet"
          />
          <q-input
            filled
            dense
            class="col"
            label="Network Explorer"
            hint="Optional"
            v-model="explorer"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="bg-grey-2">
        <q-btn
          :disable="addIsDisabled"
          no-caps
          flat
          color="primary"
          @click="addNetwork"
          >Add</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useNetworksStore } from 'src/stores/networks';
import { useQuasar } from 'quasar';

const quasar = useQuasar();
const store = useNetworksStore();

// TODO: Handle validation
// TODO: Check if the network reachable.
const show = ref(true);
const name = ref('');
const url = ref('');
const chaiId = ref(0);
const faucet = ref('');
const explorer = ref('');

const addIsDisabled = computed(() => {
  return name.value === '' && url.value === '' && chaiId.value === 0;
});

const addNetwork = () => {
  const faucetUrl = faucet.value === '' ? undefined : faucet.value;
  const explorerUrl = explorer.value === '' ? undefined : explorer.value;
  try {
    store.addNetwork(name.value, url.value, chaiId.value, faucetUrl, explorerUrl);
    quasar.notify({
      type: 'positive',
      message: `${name.value} added to the networks.`,
    });
    show.value = false;
  } catch (error) {
    quasar.notify({
      type: 'negative',
      message: `Failed to add ${name.value}. ${error}`,
    });
  }
};
</script>
