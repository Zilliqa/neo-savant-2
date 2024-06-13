import { defineStore } from 'pinia';
import { Contract, PendingContract, TransitionCalls } from '../utils/models';
import { Init, TxParams, Value, toChecksumAddress } from '@zilliqa-js/zilliqa';
import { useBlockchainStore } from './blockchain';
import { Notify } from 'quasar';

export const useContractsStore = defineStore('contracts', {
  state: () => ({
    contracts: [] as Contract[],
    pending: [] as PendingContract[],
    transitionCalls: {} as TransitionCalls,
    selected: null as Contract | null,
  }),
  actions: {
    setSelected(name: string) {
      const contract = this.getByName(name);
      if (contract === undefined) {
        throw new Error(`No contract with name of ${name}`);
      }

      this.selected = contract;
    },
    deselect() {
      this.selected = null;
    },
    async callTransition(
      contractAddress: string,
      transitionName: string,
      txParams: TxParams,
      parameters: Value[]
    ) {
      const blockchain = useBlockchainStore();
      const txHash = await blockchain.sendTransaction(
        {
          ...txParams,
          toAddr: toChecksumAddress(contractAddress),
        },
        undefined,
        JSON.stringify({
          _tag: transitionName,
          params: parameters,
        })
      );

      (this.transitionCalls[contractAddress] ??= []).push({
        vname: transitionName,
        txHash: txHash || 'N/A',
      });

      return txHash;
    },
    delete(name: string) {
      const contract = this.getByName(name);
      if (contract === undefined) {
        throw new Error(`No contract with name of ${name}`);
      }

      this.contracts = this.contracts.filter(
        (contract) => contract.name !== name
      );
    },
    async refreshPendingContracts() {
      if (this.pending.length === 0) {
        return;
      }

      const confirmed: string[] = []; // Regardless of success value
      const blockchain = useBlockchainStore();
      for (const pending of this.pending) {
        const { success } = await blockchain.getTransactionStatus(
          pending.txHash
        );
        if (success === undefined) {
          // Not confirmed yet
          continue;
        } else {
          confirmed.push(pending.txHash);
          if (success) {
            const addr = await blockchain.getContractAddressFromTransactionID(
              pending.txHash
            );
            Notify.create({
              type: 'info',
              message: `Contract deployment finished, ${pending.txHash}`,
            });
            this.contracts.push({
              name: pending.name,
              network: pending.network,
              address: addr,
            });
          } else {
            Notify.create({
              type: 'warning',
              message: `Contract deployment failed, txHash: ${pending.txHash}. Please check the transaction receipt.`,
            });
          }
        }
      }

      // Exclude confirmed contracts, regardless of success/failure.
      this.pending = this.pending.filter(
        (pending) => !confirmed.includes(pending.txHash)
      );
    },
    async deploy(
      name: string,
      code: string,
      txParams: TxParams,
      params: Value[]
    ): Promise<string> {
      const blockchain = useBlockchainStore();
      const init: Init = [
        ...params,
        {
          vname: '_scilla_version',
          type: 'Uint32',
          value: '0',
        },
      ];

      txParams.toAddr = '0x0000000000000000000000000000000000000000';
      const id = await blockchain.sendTransaction(
        txParams,
        code,
        JSON.stringify(init).replace(/\\"/g, '"')
      );

      if (id === undefined) {
        throw new Error(`Invalid transaction hash: ${id}`);
      }

      this.pending.push({
        name,
        txHash: id,
        network: blockchain.selectedNetwork?.name || 'N/A',
      });

      return id;
    },
    async import(name: string, address: string) {
      const blockchainStore = useBlockchainStore();

      await blockchainStore.getSmartContractCode(address);
      this.contracts.push({
        name,
        address,
        network: blockchainStore.selectedNetwork?.name || 'N/A',
      });
    },
  },
  getters: {
    contractsForNetwork:
      (state) =>
      (networkName: string): Contract[] => {
        try {
          return state.contracts.filter(
            (contract) => contract.network === networkName
          );
        } catch (error) {
          // No network is selected
          return [];
        }
      },
    getByName:
      (state) =>
      (name: string): Contract | undefined => {
        return state.contracts.find((item: Contract) => item.name === name);
      },
  },
  persist: true,
});
