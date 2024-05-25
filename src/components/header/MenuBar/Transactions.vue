<template>
  <q-btn-dropdown dense icon="dns" unelevated no-caps label="Transactions">
    <q-list dense>
      <div v-for="transaction in store.transactions" :key="transaction.id">
        <q-item>
          <q-item-section>
            <q-item-label>
              <truncated-text
                :text="transaction.id"
                :length="40"
                :position="20"
                :link="blockchainStore.getExplorerLinkForTx(transaction.id)"
              />
              <copy-to-clipboard-btn :content="transaction.id" />
            </q-item-label>
            <q-item-label caption>
              <q-badge
                :color="txStatusColor(transaction.statusMessage)"
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

const store = useTransactionsStore();
const blockchainStore = useBlockchainStore();
let intervalId: NodeJS.Timeout;

onMounted(() => {
  intervalId = setInterval(async () => {
    await store.refreshPendingTxns();
  }, 5000);
});

onUnmounted(() => clearInterval(intervalId));

const txStatusColor = (statusMessage: string) => {
  switch (statusMessage) {
    case 'Initialised':
      return 'blue';
    case 'Confirmed':
      return 'green';
    case 'Pending':
      return 'yellow';
    case 'Rejected':
      return 'red';
  }
};
</script>
