<template>
  <q-btn-dropdown
    dense
    unelevated
    no-caps
    :disable="blockchainStore.selectedNetwork === null"
  >
    <template v-slot:label>
      <q-icon left name="wallet" />
      <template v-if="blockchainStore.selectedAccount">
        <div class="text-bold q-mr-sm">
          {{ blockchainStore.selectedAccount?.name }}
        </div>
        <account-balance-badge :account="blockchainStore.selectedAccount"/>
      </template>
      <div v-else>Import an Account</div>
    </template>

    <q-list bordered separator>
      <template v-if="blockchainStore.managedByZilpay">
        <managed-by-zilpay />
        <q-separator></q-separator>
      </template>
      <q-item-label v-else header class="bg-grey-3 text-bold text-uppercase">
        <div class="row q-gutter-xs items-center justify-between">
          <span>Accounts</span>
          <div>
            <q-btn
              v-close-popup
              class="gt-xs"
              size="14px"
              label="Import"
              flat
              dense
              icon="person_add"
              @click="importKeystore"
            >
              <q-tooltip> Import new account </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-item-label>
      <div v-if="accountsStore.accountsForCurrentNetwork.length > 0">
        <div
          v-for="account in accountsStore.accountsForCurrentNetwork"
          :key="account.name"
        >
          <q-item
            clickable
            :active="blockchainStore.selectedAccount?.name === account.name"
            :disable="blockchainStore.managedByZilpay && account.name !== 'Zilpay'"
          >
            <q-item-section @click="selectAccount(account.name)" v-close-popup>
              <q-item-label>
                <span class="text-subtitle1 text-bold q-mr-sm">{{ account.name }}</span>
                <account-balance-badge :account="account"/>
              </q-item-label>
              <q-item-label caption>
                <div>
                  {{ account.bech32Address }}
                  <copy-to-clipboard-btn :content="account.bech32Address"/>
                </div>
                <div>
                  {{ account.address }}
                  <copy-to-clipboard-btn :content="account.address.toLowerCase()"/>
                </div>
              </q-item-label>
            </q-item-section>
            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn
                  class="gt-xs"
                  size="10px"
                  flat
                  dense
                  round
                  icon="delete"
                />
                <q-btn class="gt-xs" size="10px" flat dense round icon="edit" />
              </div>
            </q-item-section>
          </q-item>
          <q-separator />
        </div>
      </div>
      <q-item v-else>
        <q-item-section>
          <div>Click <strong>IMPORT</strong> to add a new account</div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import ImportAccountDialog from './ImportAccountDialog.vue';
import { useAccountsStore } from 'stores/accounts';
import { useQuasar } from 'quasar';
import { useBlockchainStore } from 'src/stores/blockchain';
import CopyToClipboardBtn from 'components/CopyToClipboardBtn.vue';
import AccountBalanceBadge from 'components/AccountBalanceBadge.vue';
import managedByZilpay from 'components/ManagedByZilpay.vue';

const q = useQuasar();
const blockchainStore = useBlockchainStore();
const accountsStore = useAccountsStore();

const importKeystore = () => {
  q.dialog({
    component: ImportAccountDialog,
  });
};

const selectAccount = (name: string) => {
  try {
    blockchainStore.setSelectedAccount(name);
    q.notify({
      type: 'info',
      message: `<strong>${name}</strong> account selected`,
      html: true,
    });
  } catch (error) {
    q.notify({
      type: 'negative',
      message: `Failed to select <strong>${name}</strong> account. ${error}`,
      html: true,
    });
  }
};

</script>

<style lang=""></style>
