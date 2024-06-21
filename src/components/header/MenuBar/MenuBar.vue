<template>
  <q-bar class="text-white bg-dark">
    <img src="~assets/scilla-logo.png" style="height: 30px" />
    <div class="text-weight-bolder text-h6">
      <a
        href="https://github.com/Zilliqa/neo-savant-2"
        class="text-white"
        target="_blank"
        style="text-decoration: none"
      >
        Neo Savant <span class="text-orange text-weight-bolder">v2</span>
      </a>
    </div>
    <q-separator color="grey-9" vertical class="q-ml-sm" />
    <q-btn dense flat label="Tools" no-caps icon="construction">
      <q-menu auto-close>
        <q-list dense>
          <q-item clickable>
            <q-item-section @click="showAddressConvertor"
              >Address Convertor</q-item-section
            >
          </q-item>
          <q-item clickable>
            <q-item-section @click="showUnitConvertor()"
              >Units Convertor</q-item-section
            >
          </q-item>
          <q-separator />
          <q-item clickable>
            <q-item-section @click="showTransferZilDialog()"
              >Transfer Zil</q-item-section
            >
          </q-item>
          <q-separator />
          <q-item clickable>
            <q-item-section @click="showKeystoreGenerator()"
              >Create keystore file</q-item-section
            >
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <template v-if="explorerLink !== ''">
      <q-btn
        dense
        flat
        label="Network Explorer"
        no-caps
        icon="dns"
        :href="explorerLink"
        target="_blank"
      />
      <q-separator vertical />
    </template>
    <template v-if="faucetLink !== ''">
      <q-btn
        dense
        flat
        label="Faucet"
        no-caps
        icon="account_balance"
        :href="faucetLink"
        target="_blank"
      />
    </template>
    <q-btn dense flat label="Help" no-caps icon="help">
      <q-menu auto-close>
        <q-list dense>
          <q-item
            clickable
            @click="openURL('https://scilla.readthedocs.io/en/latest/')"
          >
            <q-item-section>Scilla Docs</q-item-section>
          </q-item>
          <q-item clickable @click="openURL('https://learnscilla.com/')">
            <q-item-section>Tutorial</q-item-section>
          </q-item>
          <q-separator />
          <q-item
            clickable
            @click="openURL('https://github.com/Zilliqa/neo-savant-2')"
          >
            <q-item-section>Github Repository</q-item-section>
          </q-item>
          <q-item clickable @click="showAboutDialog()">
            <q-item-section>About</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-space />
    <q-separator color="grey-9" vertical />
    <div class="row">
      <q-space />
      <transactions></transactions>
      <q-separator vertical />
      <network-selector></network-selector>
      <q-separator vertical />
      <account-selector></account-selector>
    </div>
  </q-bar>
</template>
<script lang="ts" setup>
import NetworkSelector from 'components/header/MenuBar/NetworkSelector.vue';
import AccountSelector from 'components/header/MenuBar/AccountSelector.vue';
import Transactions from 'components/header/MenuBar/Transactions.vue';
import UnitsConverter from 'components/Tools/UnitsConverter.vue';
import AddressConverter from 'components/Tools/AddressConverter.vue';
import GenerateKeystoreFileDialog from 'components/Tools/GenerateKeystoreFileDialog.vue';
import TransferZilDialog from 'components/Tools/TransferZilDialog.vue';
import { computed } from 'vue';
import { useQuasar, openURL } from 'quasar';
import { useBlockchainStore } from 'src/stores/blockchain';

const q = useQuasar();
const blockchain = useBlockchainStore();

const faucetLink = computed(() => {
  if (
    !blockchain.selectedNetwork ||
    !blockchain.selectedNetwork.faucet ||
    !blockchain.selectedAccount
  ) {
    return '';
  }

  return blockchain.selectedNetwork.faucet.replace(
    '{ADDRESS}',
    blockchain.selectedAccount.bech32Address
  );
});

const explorerLink = computed(() => {
  if (!blockchain.selectedNetwork || !blockchain.selectedNetwork.explorer) {
    return '';
  }

  return blockchain.selectedNetwork.explorer;
});

function showUnitConvertor() {
  q.dialog({
    component: UnitsConverter,
  });
}

function showAddressConvertor() {
  q.dialog({
    component: AddressConverter,
  });
}

function showKeystoreGenerator() {
  q.dialog({
    component: GenerateKeystoreFileDialog,
  });
}

function showTransferZilDialog() {
  q.dialog({
    component: TransferZilDialog,
  });
}

function showAboutDialog() {
  q.dialog({
    title: 'Neo Savant 2.1.0',
    message:
      'Neo Savant is Zilliqa IDE that allows you to write, deploy and interact with smart contracts on the Zilliqa blockchain.',
  });
}
</script>
