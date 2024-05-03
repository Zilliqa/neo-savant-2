import { defineStore } from 'pinia';
import { WaitingTransaction } from '../utils/models';
import { useNetworksStore } from './networks';

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [] as WaitingTransaction[],
  }),
  getters: {
    getTransactionById: (state) => (txHash: string) => {
      return state.transactions.find((item) => item.id === txHash);
    },
    pending: (state) => {
      return state.transactions.filter((tx) =>
        tx.statusMessage.startsWith('Pending')
      );
    },
  },
  actions: {
    add(tx: WaitingTransaction) {
      this.transactions.push(tx);
    },
    async refreshPendingTxns() {
      await Promise.all(
        this.pending.map((tx) => this.refreshTransactionStatus(tx.id))
      );
    },
    async refreshTransactionStatus(txHash: string) {
      const txn = this.getTransactionById(txHash);
      if (txn === undefined) {
        throw new Error(`No transaction with id: ${txHash}`);
      }

      const networksStore = useNetworksStore();
      const zilliqa = networksStore.getZilliqa(txn.network);

      const response = await zilliqa.blockchain.getTransactionStatus(txHash);
      txn.statusMessage = response.statusMessage;
      return response;
    },
  },
  persist: true,
});
