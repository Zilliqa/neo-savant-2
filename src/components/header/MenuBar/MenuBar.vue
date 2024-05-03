<template>
  <q-bar class="bg-grey-3 text-grey-8 shadow-1">
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
    <q-separator vertical/>
    <q-btn dense flat label="Network Explorer" no-caps icon="dns" />
    <q-separator vertical/>
    <q-btn dense flat label="Faucet" no-caps icon="account_balance" />
    <q-separator vertical/>
    <q-btn dense flat label="Help" no-caps icon="help">
      <q-menu auto-close>
        <q-list dense>
          <q-item clickable>
            <q-item-section>Scilla Docs</q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section>Tutorial</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-space/>
    <div class="row">
      <q-space/>
      <transactions></transactions>
      <q-separator vertical />
      <network-selector></network-selector>
      <q-separator vertical />
      <account-selector></account-selector>
    </div>
  </q-bar>
</template>
<script setup lang="ts">
import NetworkSelector from 'components/header/MenuBar/NetworkSelector.vue';
import AccountSelector from 'components/header/MenuBar/AccountSelector.vue';
import Transactions from 'components/header/MenuBar/Transactions.vue';
import { useQuasar } from 'quasar';
import UnitsConverter from 'components/Tools/UnitsConverter.vue';
import AddressConverter from 'components/Tools/AddressConverter.vue';
import GenerateKeystoreFileDialog from 'components/Tools/GenerateKeystoreFileDialog.vue';
import TransferZilDialog from 'components/Tools/TransferZilDialog.vue';

const q = useQuasar();

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
</script>
<style lang=""></style>
