import { defineStore } from 'pinia';
import { Account, KeystoreAccount, Network } from '../utils/models';
import { useAccountsStore } from './accounts';
import { useNetworksStore } from './networks';
import { BN, bytes, units } from '@zilliqa-js/util';
import { TxParams, Zilliqa, toChecksumAddress } from '@zilliqa-js/zilliqa';
import { useTransactionsStore } from './transactions';
import Long from 'long';

export const useBlockchainStore = defineStore('blockchain', {
  state: () => ({
    selectedAccount: null as Account | null,
    selectedNetwork: null as Network | null,
    zilliqa: null as Zilliqa | null,
  }),
  getters: {
    getBalance: (state) => {
      return async (address: string) => {
        if (state.zilliqa === null) {
          throw new Error('Please select a network');
        }
        const balance = await state.zilliqa.blockchain.getBalance(address);
        if (
          balance === undefined ||
          (balance.error && balance.error.code === -5)
        ) {
          return '0';
        } else {
          return units.fromQa(new BN(balance.result.balance), units.Units.Zil);
        }
      };
    },
    getTransactionReceipt: (state) => {
      return async (txHash: string) => {
        if (state.zilliqa === null) {
          throw new Error('Please select a network');
        }
        const tx = await state.zilliqa.blockchain.getTransaction(txHash);

        return tx.getReceipt();
      };
    },
    getContractAddressFromTransactionID: (state) => {
      return async (txHash: string) => {
        if (state.zilliqa === null) {
          throw new Error('Please select a network');
        }
        const contractAddress =
          await state.zilliqa.blockchain.getContractAddressFromTransactionID(
            txHash
          );
        if (contractAddress.result) {
          return contractAddress.result;
        }

        throw new Error('Failed to get contract address');
      };
    },
    getSmartContractCode: (state) => {
      return async (address: string) => {
        if (state.zilliqa === null) {
          throw new Error('Please select a network');
        }

        const contractCode =
          await state.zilliqa.blockchain.getSmartContractCode(address);

        if (contractCode.error) {
          throw new Error(contractCode.error.message);
        }

        return contractCode.result.code;
      };
    },
    getSmartContractState: (state) => {
      return async (address: string) => {
        if (state.zilliqa === null) {
          throw new Error('Please select a network');
        }

        const response = await state.zilliqa.blockchain.getSmartContractState(
          address
        );

        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.result;
      };
    },
    minimumGasPrice: async (state) => {
      if (state.zilliqa === null) {
        throw new Error('Please select a network');
      }
      return (await state.zilliqa.blockchain.getMinimumGasPrice()).result;
    },
    selectedNetworkName: (state) => {
      if (state.selectedNetwork === null) {
        throw new Error('Please select a network');
      }
      return state.selectedNetwork.name;
    },
    selectedNetworkVersion(state): number {
      if (state.selectedNetwork === null) {
        throw new Error('Please select a network');
      }

      return bytes.pack(
        state.selectedNetwork.chainId,
        state.selectedNetwork.msgVersion
      );
    },
  },
  actions: {
    addKeystoreAccount(account: KeystoreAccount) {
      if (this.zilliqa === null) {
        throw new Error('Please select a network.');
      }
      this.zilliqa.wallet.addByKeystore(account.keystore, account.passphrase);
    },
    addAccount(privateKey: string) {
      if (this.zilliqa === null) {
        throw new Error('Please select a network.');
      }
      this.zilliqa.wallet.addByPrivateKey(privateKey);
    },
    setSelectedAccount(name: string) {
      const accountsStore = useAccountsStore();
      const account = accountsStore.getByName(name);
      if (account === undefined) {
        throw new Error(`No account with name of ${name}`);
      }
      this.selectedAccount = account;
    },
    setSelectedNetwork(name: string) {
      const networksStore = useNetworksStore();
      const network = networksStore.getByName(name);
      if (network) {
        this.selectedAccount = null;
        this.selectedNetwork = network;
        this.zilliqa = new Zilliqa(network.url);
      } else {
        throw new Error(`No network named ${name}`);
      }
    },
    async transferZil(recipientAddress: string, amount: BN) {
      return this.sendTransaction({
        version: this.selectedNetworkVersion,
        toAddr: toChecksumAddress(recipientAddress),
        amount,
        gasPrice: units.toQa('2000', units.Units.Li),
        gasLimit: Long.fromNumber(50),
      });
    },
    async refreshSelectedAccountBalance() {
      if (this.selectedAccount === null) {
        throw new Error('Please select an account.');
      }

      const balance = await this.getBalance(this.selectedAccount.address);
      this.selectedAccount.balance = balance;
    },
    async sendTransaction(txParams: TxParams, code?: string, data?: string) {
      if (this.zilliqa == null) {
        throw new Error('Please select a network for contract deployment');
      }

      if (this.selectedAccount === null) {
        throw new Error('Please select an account.');
      }

      const tx = this.zilliqa.transactions.new(
        {
          ...txParams,
          version: this.selectedNetworkVersion,
          code,
          data,
        },
        true
      );

      const txn = await this.zilliqa.blockchain.createTransactionWithoutConfirm(
        tx
      );

      const store = useTransactionsStore();
      store.add({
        id: txn.id || 'NO_ID',
        statusMessage: 'Initialized',
        network: this.selectedNetworkName,
        amount: txParams.amount,
        from: this.zilliqa.wallet.defaultAccount?.bech32Address || 'N/A',
        to: txParams.toAddr,
      });
      return txn.id;
    },
  },
});
