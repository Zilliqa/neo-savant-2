import { defineStore } from 'pinia';
import { Zilliqa } from '@zilliqa-js/zilliqa';
import { Network } from '../utils/models';

export const useNetworksStore = defineStore('networks', {
  state: () => ({
    networks: [
      {
        name: 'Simulated ENV',
        url: 'https://scilla-server.zilliqa.com/contract/check',
        chainId: 222,
        msgVersion: 1,
      },
      {
        name: 'Testnet',
        url: 'https://dev-api.zilliqa.com',
        chainId: 333,
        msgVersion: 1,
      },
      {
        name: 'Mainnet',
        url: 'https://api.zilliqa.com',
        chainId: 1,
        msgVersion: 1,
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
    addNetwork(name: string, url: string, chainId: number) {
      if (this.getByName(name) !== undefined) {
        throw new Error('There is already another network with the same name.');
      }
      this.networks.push({
        name,
        url,
        chainId,
        msgVersion: 1,
        zilliqa: new Zilliqa(url),
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
