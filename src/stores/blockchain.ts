import { defineStore } from 'pinia';
import {
  Account,
  AccountType,
  KeystoreAccount,
  LedgerAccount,
  Network,
} from '../utils/models';
import { useAccountsStore } from './accounts';
import { useNetworksStore } from './networks';
import { BN, bytes, units } from '@zilliqa-js/util';
import { TxParams, Zilliqa, toChecksumAddress } from '@zilliqa-js/zilliqa';
import { useTransactionsStore } from './transactions';
import {
  TransactionStatus,
  interpretTransactionStatus,
  zilpayHelper,
} from 'src/utils';
import { ledgerHelper } from 'src/utils';
import { Notify } from 'quasar';
import Long from 'long';

export const useBlockchainStore = defineStore('blockchain', {
  state: () => ({
    selectedAccount: null as Account | null,
    selectedNetwork: null as Network | null,
    zilliqa: null as Zilliqa | null,
    managedByZilpay: false,
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
    getNonce: (state) => {
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
          return balance.result.nonce;
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
    getSmartContractSubState: (state) => {
      return async (
        address: string,
        variableName: string,
        indices?: string[]
      ) => {
        if (state.zilliqa === null) {
          throw new Error('Please select a network');
        }

        const response =
          await state.zilliqa.blockchain.getSmartContractSubState(
            address,
            variableName,
            indices
          );

        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.result;
      };
    },
    getSmartContractInit: (state) => {
      return async (address: string) => {
        if (state.zilliqa === null) {
          throw new Error('Please select a network');
        }

        const response = await state.zilliqa.blockchain.getSmartContractInit(
          address
        );

        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.result;
      };
    },
    getTransactionStatus: (state) => {
      return async (
        txHash: string
      ): Promise<{
        status: TransactionStatus;
        statusMessage: string;
        success: boolean | undefined;
      }> => {
        if (state.zilliqa === null) {
          throw new Error('Please select a network');
        }

        const response = await state.zilliqa.blockchain.getTransactionStatus(
          txHash
        );

        const status = interpretTransactionStatus(response);

        return {
          ...status,
          success:
            status.status === 'Confirmed' || status.status === 'Rejected'
              ? response.success
              : undefined,
        };
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
    getExplorerLinkForTx: (state) => {
      return (txHash: string) => {
        if (
          state.selectedNetwork === null ||
          !state.selectedNetwork.txQueryLink
        ) {
          return null;
        }

        return state.selectedNetwork.txQueryLink.replace('{TX}', txHash);
      };
    },
    getExplorerLinkForContract: (state) => {
      return (address: string) => {
        if (
          state.selectedNetwork === null ||
          !state.selectedNetwork.contractQueryLink
        ) {
          return null;
        }

        return state.selectedNetwork.contractQueryLink.replace(
          '{CONTRACT}',
          address
        );
      };
    },
  },
  actions: {
    setManagedByZilpay(managed: boolean) {
      this.managedByZilpay = managed;
      if (!managed) {
        this.selectedAccount = null;
        const accountsStore = useAccountsStore();
        accountsStore.remove('Zilpay');
      }
    },
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
    removeAccount(account: Account) {
      if (this.selectedAccount && this.selectedAccount.name === account.name) {
        this.selectedAccount = null;
      }

      this.zilliqa?.wallet.remove(account.address);
    },
    setSelectedAccount(name: string) {
      if (this.selectedAccount && this.selectedAccount.name === name) {
        // Nothing to do. It's already selected.
        return;
      }
      const accountsStore = useAccountsStore();
      const account = accountsStore.getByName(name);
      if (account === undefined) {
        throw new Error(`No account with name of ${name}`);
      }
      this.selectedAccount = account;
      this.refreshSelectedAccountBalance().then(() => {
        /* */
      });
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

      let txnId: string;
      if (this.managedByZilpay) {
        const tx = this.zilliqa.transactions.new(
          {
            ...txParams,
            version: this.selectedNetworkVersion,
            code,
            data,
          },
          true
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const txn = await zilpayHelper.signTx(tx as any);
        txnId = txn.ID;
      } else if (this.selectedAccount.accountType === AccountType.LEDGER) {
        const nonce = await this.getNonce(this.selectedAccount.address);
        const pubKey = (this.selectedAccount.account as LedgerAccount)
          .publicKey;
        const tx = this.zilliqa.transactions.new(
          {
            ...txParams,
            version: this.selectedNetworkVersion,
            code,
            data,
            nonce: nonce + 1,
            pubKey,
            signature: '',
          },
          true
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const index = (this.selectedAccount.account as LedgerAccount).index;

        Notify.create({
          message: 'Please sign the transaction with your ledger',
          type: 'info',
          progress: true,
          actions: [
            {
              label: 'OK',
              color: 'white',

              handler: () => {
                /* ... */
              },
            },
          ],
        });
        const sig = (await ledgerHelper.signTx(index, tx.txParams)).sig;
        const payload = JSON.stringify({
          ...tx.txParams,
          amount: tx.txParams.amount.toString(),
          gasPrice: tx.txParams.gasPrice.toString(),
          gasLimit: tx.txParams.gasLimit.toString(),
          priority: true,
          signature: sig,
        });
        txnId = await this.zilliqa.blockchain.createTransactionRaw(payload);
      } else {
        const tx = this.zilliqa.transactions.new(
          {
            ...txParams,
            version: this.selectedNetworkVersion,
            code,
            data,
          },
          true
        );
        const txn =
          await this.zilliqa.blockchain.createTransactionWithoutConfirm(tx);
        txnId = txn.id || 'NO_ID';
      }

      const store = useTransactionsStore();
      store.add({
        id: txnId,
        status: 'Initialized',
        statusMessage: 'Initialized',
        network: this.selectedNetworkName,
        amount: txParams.amount,
        from: this.zilliqa.wallet.defaultAccount?.bech32Address || 'N/A',
        to: txParams.toAddr,
      });
      return txnId;
    },
  },
  persist: {
    paths: ['selectedNetwork'],
    afterRestore: (context) => {
      if (context.store.selectedNetwork) {
        context.store.zilliqa = new Zilliqa(context.store.selectedNetwork.url);
      }
    },
  },
});
