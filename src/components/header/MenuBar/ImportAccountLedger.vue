<template>
  <div class="column">
    <div class="row items-center q-gutter-x-sm">
      <q-select
        dense
        outlined
        v-model="ledgerTransportType"
        :options="ledgerTransportTypes"
        inline
      />
      <q-btn no-caps color="dark" @click="connectToLedger">Connect</q-btn>
      <q-space />
      <q-input v-model="accountName" label="Account Name" dense outlined />
      <q-btn
        :disable="!connectedToLedger"
        :loading="confirmOnLedger"
        no-caps
        color="dark"
        @click="importLedgerAccount"
        >Import #{{ ledgerIndex }} account</q-btn
      >
    </div>
    <div v-if="confirmOnLedger" class="text-warning text-bold q-ma-sm">
      ⚠️ Please confirm action on Ledger Device
    </div>
    <q-table
      no-data-label="To import an account, connect to Ledger and click Import"
      class="q-mt-lg"
      dense
      flat
      :hide-bottom="ledgerAccounts.length > 0"
      :rows="ledgerAccounts"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="index" :props="props">{{ props.row.index }}</q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="address" :props="props">{{ props.row.address }}</q-td>
          <q-td key="balance" :props="props">{{ props.row.balance }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { LedgerHelper, LedgerTransportType, ledgerHelper } from 'src/utils';
import { useQuasar } from 'quasar';
import { useAccountsStore } from 'src/stores/accounts';
import { useBlockchainStore } from 'src/stores/blockchain';

const ledgerTransportType = ref<undefined | string>(undefined);
const ledgerTransportTypes = ref<
  { label: string; value: string; disable: boolean }[]
>([]);

const ledgerIndex = ref(0);
const q = useQuasar();
const confirmOnLedger = ref(false);
const accountsStore = useAccountsStore();
const connectedToLedger = ref(false);
const accountName = ref(`Ledger ${ledgerIndex.value}`);

interface LedgerAccount {
  index: number;
  name: string;
  address: string;
  balance: string;
}

const ledgerAccounts = ref<LedgerAccount[]>([]);

const columns = [
  {
    name: 'index',
    label: 'Index',
    field: 'index',
  },
  {
    name: 'name',
    label: 'Account Name',
    field: 'name',
  },
  {
    name: 'address',
    label: 'Address',
    field: 'address',
  },
  {
    name: 'balance',
    label: 'Balance',
    field: 'balance',
  },
];

onMounted(async () => {
  for (const type of Object.keys(LedgerTransportType)) {
    const supported = await LedgerHelper.isTransportSupported(
      type as LedgerTransportType
    );

    if (ledgerTransportType.value === undefined && supported) {
      ledgerTransportType.value = type;
    }

    ledgerTransportTypes.value.push({
      label: type,
      value: type,
      disable: !supported,
    });
  }
});

const connectToLedger = async () => {
  try {
    await ledgerHelper.connect(
      ledgerTransportType.value as LedgerTransportType
    );
    connectedToLedger.value = true;
    q.notify({
      type: 'info',
      message: 'Successfully connected to Ledger!',
    });
  } catch (error) {
    q.notify({
      type: 'negative',
      message: `Failed to connect to Ledger. ${error}`,
    });
  }
};

const importLedgerAccount = async () => {
  const blockchainStore = useBlockchainStore();
  try {
    confirmOnLedger.value = true;
    const account = await ledgerHelper.getPublicAddress(ledgerIndex.value);
    if (account === undefined) {
      throw new Error('Failed to import account');
    }
    ledgerAccounts.value.push({
      index: ledgerIndex.value,
      name: accountName.value,
      address: account.pubAddr,
      balance: await blockchainStore.getBalance(account.pubAddr),
    });
    ledgerIndex.value += 1;
    accountName.value = `Ledger ${ledgerIndex.value}`;
  } catch (error) {
    q.notify({
      type: 'negative',
      message: `Failed to import. ${error}`,
    });
  } finally {
    confirmOnLedger.value = false;
  }
};
</script>
