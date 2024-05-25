import { defineStore } from 'pinia';
import { Zilliqa } from '@zilliqa-js/zilliqa';
import { Network } from '../utils/models';

export const useNetworksStore = defineStore('networks', {
  state: () => ({
    networks: [
      {
        name: 'Simulated ENV',
        url: 'https://zilliqa-isolated-server.zilliqa.com/',
        chainId: 222,
        msgVersion: 1,
        faucet:
          'https://dev-wallet.zilliqa.com/faucet?address={ADDRESS}&network=isolated_server',
        explorer:
          'https://devex.zilliqa.com/?network=https://zilliqa-isolated-server.zilliqa.com/',
        txQueryLink:
          'https://devex.zilliqa.com/tx/{TX}?network=https://zilliqa-isolated-server.zilliqa.com/',
        contractQueryLink:
          'https://devex.zilliqa.com/address/{CONTRACT}?network=https://zilliqa-isolated-server.zilliqa.com/',
      },
      {
        name: 'Testnet',
        url: 'https://dev-api.zilliqa.com',
        chainId: 333,
        msgVersion: 1,
        faucet:
          'https://dev-wallet.zilliqa.com/faucet?address={ADDRESS}&network=testnet',
        explorer:
          'https://devex.zilliqa.com/?network=https://dev-api.zilliqa.com',
        txQueryLink:
          'https://devex.zilliqa.com/tx/{TX}?network=https://dev-api.zilliqa.com',
        contractQueryLink:
          'https://devex.zilliqa.com/address/{CONTRACT}?network=https://dev-api.zilliqa.com',
      },
      {
        name: 'Mainnet',
        url: 'https://api.zilliqa.com',
        chainId: 1,
        msgVersion: 1,
        explorer: 'https://devex.zilliqa.com/?network=https://api.zilliqa.com',
      },
    ] as Network[],
  }),
  getters: {
    getZilliqa: (state) => (name: string) => {
      const network = state.networks.find((network) => network.name === name);
      if (network === undefined) {
        throw new Error(`No network with name of ${name}`);
      }

      return new Zilliqa(network.url);
    },
    getByName: (state) => (name: string) => {
      return state.networks.find((network) => network.name === name);
    },
  },
  actions: {
    addNetwork(
      name: string,
      url: string,
      chainId: number,
      faucet?: string,
      explorer?: string,
      txQueryLink?: string,
      contractQueryLink?: string
    ) {
      if (this.getByName(name) !== undefined) {
        throw new Error('There is already another network with the same name.');
      }
      this.networks.push({
        name,
        url,
        chainId,
        msgVersion: 1,
        faucet,
        explorer,
        txQueryLink,
        contractQueryLink,
      });
    },
    deleteNetwork(name: string) {
      const network = this.getByName(name);
      if (network === undefined) {
        throw new Error('Network not found.');
      } else {
        this.networks = this.networks.filter(
          (network) => network.name !== name
        );
      }
    },
  },
  persist: true,
});
