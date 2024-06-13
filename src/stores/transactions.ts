import { defineStore } from 'pinia';
import { Transaction } from '../utils/models';
import { useBlockchainStore } from './blockchain';
import { eventBus } from 'src/event-bus';

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [] as Transaction[],
    pending: 0 as number,
    rejected: 0 as number,
    confirmed: 0 as number,
  }),
  getters: {
    pendingTransactions: (state) => {
      try {
        return state.transactions.filter(
          (tx: Transaction) =>
            tx.status &&
            (tx.status === 'Pending' || tx.status === 'Initialized')
        );
      } catch (error) {
        return [];
      }
    },
    getTransactionById: (state) => (txHash: string) => {
      return state.transactions.find((item) => item.id === txHash);
    },
  },
  actions: {
    add(tx: Transaction) {
      this.transactions = [tx, ...this.transactions];
    },
    delete(txHash: string) {
      this.transactions = this.transactions.filter(
        (tx: Transaction) => tx.id !== txHash
      );
    },
    async refreshTransactionStatus(txHash: string) {
      const txn = this.getTransactionById(txHash);
      if (txn === undefined) {
        throw new Error(`No transaction with id: ${txHash}`);
      }

      const blockchainStore = useBlockchainStore();
      const { status, statusMessage, success } =
        await blockchainStore.getTransactionStatus(txHash);
      txn.status = status;
      txn.statusMessage = statusMessage;
      txn.success = success;
    },
    async refreshPendingTxns() {
      const blockchainStore = useBlockchainStore();
      let confirmedCount = 0;
      let rejectedCount = 0;
      let pendingCount = 0;
      if (this.pendingTransactions.length === 0) {
        return;
      }

      await Promise.all(
        this.pendingTransactions.map(async (tx: Transaction) => {
          const { status, statusMessage, success } =
            await blockchainStore.getTransactionStatus(tx.id);
          tx.status = status;
          tx.statusMessage = statusMessage;
          tx.success = success;
          switch (status) {
            case 'Confirmed':
              confirmedCount++;
              break;
            case 'Rejected':
              rejectedCount++;
              break;
            case 'Pending':
              pendingCount++;
              break;
          }
        })
      );

      if (
        confirmedCount !== this.confirmed ||
        rejectedCount !== this.rejected ||
        pendingCount !== this.pending
      ) {
        this.confirmed = confirmedCount;
        this.rejected = rejectedCount;
        this.pending = pendingCount;
        eventBus.emit(
          'pending-txn-status-changed',
          this.pending,
          this.confirmed,
          this.rejected
        );
      }
    },
  },
  persist: true,
});
