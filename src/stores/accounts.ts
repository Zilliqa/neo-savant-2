import { defineStore } from 'pinia';
import { Account, KeystoreAccount, PrivatekeyAccount } from 'src/utils';
import { useBlockchainStore } from './blockchain';

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    add(
      name: string,
      address: string,
      bech32Address: string,
      networks: string[],
      account: KeystoreAccount | PrivatekeyAccount
    ) {
      if (this.getByName(name) !== undefined) {
        throw new Error(
          `There is already another account with the same name, ${name}`
        );
      }
      this.accounts.push({
        name,
        address,
        bech32Address,
        account,
        networks,
        balance: '0',
      });
      const blockchainStore = useBlockchainStore();
      if ('keystore' in account) {
        blockchainStore.addKeystoreAccount(account);
      } else {
        blockchainStore.addAccount(account.privateKey);
      }
    },
    async refreshBalance(name: string) {
      const account = this.getByName(name);
      if (account === undefined) {
        throw new Error(`No account with name of ${name}`);
      }

      const blockchainStore = useBlockchainStore();
      const balance = await blockchainStore.getBalance(account.address);
      account.balance = balance;
    },
  },
  getters: {
    getByName:
      (state) =>
      (name: string): Account | undefined => {
        return state.accounts.find((item: Account) => item.name === name);
      },
    accountsForCurrentNetwork(state): Account[] {
      const blockchainStore = useBlockchainStore();
      const selectedNetworkName = blockchainStore.selectedNetworkName;
      return state.accounts.filter((account) =>
        account.networks.includes(selectedNetworkName)
      );
    },
  },
});
