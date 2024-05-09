<template>
  <q-dialog
    v-model="show"
    :persistent="false"
    :no-esc-dismiss="false"
    backdrop-filter="blur(4px)"
  >
    <q-card style="width: 500px; max-width: 80vw">
      <q-tabs
        v-model="tab"
        dense
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="privatekey" label="Private Key" />
        <q-tab name="keystore" label="Keystore" />
        <q-tab name="zilpay" label="Zilpay" />
        <q-tab name="ledger" label="Ledger" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="privatekey">
          <div class="text-h6 q-mb-sm">Import Private Key</div>
          <div class="column q-gutter-md">
            <q-input
              filled
              dense
              class="col"
              label="Name"
              v-model="accountName"
            />
            <q-select
              filled
              multiple
              dense
              use-chips
              stack-label
              class="col"
              label="Add to"
              v-model="forNetworks"
              :options="networkNames"
            />
            <q-input
              filled
              dense
              class="col"
              label="Private key"
              v-model="privateKey"
            />
          </div>
        </q-tab-panel>
        <q-tab-panel name="keystore">
          <div class="text-h6 q-mb-sm">Import Keystore File</div>
          <div class="column q-gutter-md">
            <q-input
              filled
              dense
              class="col"
              label="Name"
              v-model="accountName"
            />
            <q-select
              filled
              multiple
              dense
              use-chips
              stack-label
              class="col"
              label="Add to"
              v-model="forNetworks"
              :options="networkNames"
            />
            <q-file
              filled
              dense
              v-model="keystoreFile"
              label="Pick a keystore file"
            />
            <q-input
              filled
              dense
              class="col"
              label="Passphrase"
              type="password"
              v-model="secret"
            />
          </div>
        </q-tab-panel>

        <q-tab-panel name="zilpay">
          <div class="text-h6 q-mb-sm">Connect to Zilpay</div>
          Just make sure you're logged in your Zilpay wallet and click Connect.
        </q-tab-panel>

        <q-tab-panel name="ledger">
          NOT SUPPORTED YET
        </q-tab-panel>
      </q-tab-panels>

      <q-separator />
      <q-card-actions align="right" class="bg-grey-2">
        <q-btn no-caps flat color="primary" @click="importAccount">{{tab !== 'zilpay' ? 'Import' : 'Connect'}}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Account } from '@zilliqa-js/account';
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useAccountsStore } from 'stores/accounts';
import { useNetworksStore } from 'stores/networks';
import { useBlockchainStore } from 'src/stores/blockchain';
import { readFileAsText } from 'src/utils';
import { zilpayHelper } from 'src/utils';

const secret = ref('');
const keystoreFile = ref<File | null>(null);
const accountName = ref('Account 1');
const privateKey = ref('');
const q = useQuasar();
const store = useAccountsStore();
const networksStore = useNetworksStore();
const blockchainStore = useBlockchainStore();
const show = ref(true);
const tab = ref('privatekey');
const forNetworks = ref<string[]>(
  blockchainStore.selectedNetwork === null
    ? []
    : [blockchainStore.selectedNetwork.name]
);
const networkNames = computed(() => {
  return networksStore.networks.map((network) => network.name);
});

const importAccount = async () => {
  switch (tab.value) {
    case 'privatekey':
      return loadPrivateKey();
    case 'keystore':
      return await loadKeystore();
    case 'zilpay':
      return await connectToZilpay();
  }
}

const loadPrivateKey = () => {
  const account = new Account(privateKey.value);
  store.add(accountName.value, account.address, account.bech32Address, forNetworks.value, {
    privateKey: privateKey.value,
  });
  show.value = false;
  q.notify({
    type: 'info',
    message: `${account.bech32Address} imported successfully.`,
  });
}

const loadKeystore = async () => {
  if (keystoreFile.value == null) {
    q.notify({
      type: 'warning',
      message: 'Please select a valid keystore file.',
    });
    return;
  }

  const keystore = await readFileAsText(keystoreFile.value);
  try {
    const account = await Account.fromFile(keystore.toString(), secret.value);
    store.add(accountName.value, account.address, account.bech32Address, forNetworks.value, {
      keystore: keystore.toString(),
      passphrase: secret.value,
    });
    q.notify({
      type: 'info',
      message: `${account.bech32Address} imported successfully.`,
    });
    show.value = false;
  } catch (error) {
    q.notify({
      type: 'negative',
      message: `Failed to import. ${error}`,
    });
  }
};

const connectToZilpay = async () => {
  try {
    await zilpayHelper.connect()
    q.notify({
      type: 'info',
      message: 'Successfully connected to Zilpay wallet!'
    });
    show.value = false;
  } catch (error) {
    q.notify({
      type: 'negative',
      message: `Failed to connect to Zilpay. ${error}`,
    });
  }
}

</script>
