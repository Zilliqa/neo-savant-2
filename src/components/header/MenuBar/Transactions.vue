<template>
  <q-btn-dropdown
    dense
    icon="dns"
    unelevated
    no-caps
    @hide="
      rejectedCount = 0;
      confirmedCount = 0;
    "
  >
    <template v-slot:label>
      Transactions
      <q-badge
        v-if="pendingCount > 0"
        color="orange-5"
        class="q-ml-xs text-bold"
        rounded
        >{{ pendingCount }}
        <q-tooltip>Pending</q-tooltip>
      </q-badge>
      <q-badge
        v-if="confirmedCount > 0"
        color="green-5"
        class="q-ml-xs text-bold"
        rounded
        >{{ confirmedCount }}
        <q-tooltip>Confirmed</q-tooltip>
      </q-badge>
      <q-badge
        v-if="rejectedCount > 0"
        color="red-5"
        class="q-ml-xs text-bold"
        rounded
        >{{ rejectedCount }}
        <q-tooltip>Rejected</q-tooltip>
      </q-badge>
    </template>

    <q-list dense>
      <div v-for="transaction in store.transactions" :key="transaction.id">
        <q-item>
          <q-item-section>
            <q-item-label>
              <div
                :class="`row items-center q-gutter-x-xs bg-${listItemBgColor(
                  transaction.success
                )}`"
                style="border-radius: 4px"
              >
                <q-circular-progress
                  indeterminate
                  rounded
                  size="14px"
                  color="orange"
                  v-if="transaction.success === undefined"
                />
                <q-icon
                  v-else-if="transaction.success"
                  name="task_alt"
                  color="green"
                >
                  <q-tooltip>Transaction was successful</q-tooltip>
                </q-icon>
                <q-icon v-else name="highlight_off" color="red">
                  <q-tooltip>Transaction failed</q-tooltip>
                </q-icon>
                <truncated-text
                  :text="transaction.id"
                  :length="40"
                  :position="20"
                  :link="blockchainStore.getExplorerLinkForTx(transaction.id)"
                />
                <copy-to-clipboard-btn :content="transaction.id" />
              </div>
            </q-item-label>
            <q-item-label caption>
              <q-badge
                :color="txStatusColor(transaction.status)"
                class="text-bold"
              >
                {{ transaction.statusMessage }} </q-badge
              ><br />
              From: {{ transaction.from }} <br />
              To: {{ transaction.to }} <br />
              Amount: {{ transaction.amount }} <br />
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-item-label>
              <transaction-status-refresher-btn :tx-hash="transaction.id" />
              <transaction-receipt-btn :tx-hash="transaction.id" />
              <q-btn
                flat
                icon="delete"
                round
                size="sm"
                @click="store.delete(transaction.id)"
              >
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
      </div>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { useTransactionsStore } from 'src/stores/transactions';
import TransactionStatusRefresherBtn from './TransactionStatusRefresherBtn.vue';
import TransactionReceiptBtn from 'src/components/TransactionReceiptBtn.vue';
import CopyToClipboardBtn from 'src/components/CopyToClipboardBtn.vue';
import TruncatedText from 'components/TruncatedText.vue';
import { useBlockchainStore } from 'src/stores/blockchain';
import { onMounted, onUnmounted } from 'vue';
import { TransactionStatus } from 'src/utils';
import { ref } from 'vue';
import { eventBus } from 'src/event-bus';

const store = useTransactionsStore();
const blockchainStore = useBlockchainStore();
let intervalId: NodeJS.Timeout;
const pendingCount = ref(0);
const confirmedCount = ref(0);
const rejectedCount = ref(0);

onMounted(() => {
  intervalId = setInterval(async () => {
    await store.refreshPendingTxns();
  }, 5000);

  eventBus.on(
    'pending-txn-status-changed',
    (pending: number, confirmed: number, rejected: number) => {
      pendingCount.value = pending;
      confirmedCount.value = confirmed;
      rejectedCount.value = rejected;
    }
  );
});

onUnmounted(() => clearInterval(intervalId));

const txStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case 'Initialized':
      return 'blue';
    case 'Confirmed':
      return 'green';
    case 'Pending':
      return 'orange';
    case 'Rejected':
      return 'red';
  }
};

const listItemBgColor = (success: boolean | undefined) => {
  if (success === undefined) {
    return 'yellow-1';
  } else if (success) {
    return 'green-1';
  } else {
    return 'red-1';
  }
};
</script>
