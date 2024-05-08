import {
  ZilPay,
  ObservableNetwork,
  ZilPayTransaction,
  ObservableAccount,
} from 'zilpay-types';

import { useBlockchainStore } from 'src/stores/blockchain';
import { useAccountsStore } from 'src/stores/accounts';

declare global {
  interface Window {
    zilPay: ZilPay;
  }
}

export class ZilpayHelper {
  async connect() {
    await this.test();
    const blockchainStore = useBlockchainStore();
    blockchainStore.setManagedByZilpay(true);
    this.subscribeToChanges();
    this.updateSelectedNetwork();
    this.updateSelectedAccount();
  }

  disconnect() {
    const blockchainStore = useBlockchainStore();
    blockchainStore.setManagedByZilpay(false);
    if (this.observableNetwork && !this.observableNetwork.isStopped) {
      this.observableNetwork.unsubscribe();
    }

    if (this.observableAccount && !this.observableAccount.isStopped) {
      this.observableAccount.unsubscribe();
    }
  }

  private isLoadTab() {
    return new Promise((resolve) => {
      if (window.document.readyState === 'complete') {
        resolve(true);
      }
      window.onload = function () {
        setTimeout(() => resolve(true), 1000);
      };
    });
  }

  private async test() {
    await this.isLoadTab();

    if (typeof window.zilPay === 'undefined') {
      throw new Error('ZilPay is not installed!');
    }

    console.log(window.zilPay);
    if (!window.zilPay.wallet.isConnect) {
      return window.zilPay.wallet.connect();
    }
  }

  private getNetwork() {
    const { wallet } = window.zilPay;

    return wallet.net;
  }

  private updateSelectedNetwork() {
    const net = this.getNetwork();
    const blockchainStore = useBlockchainStore();
    const ourNet = this.zilpayNetToOurNet(net);
    blockchainStore.setSelectedNetwork(ourNet);
  }

  private async updateSelectedAccount() {
    const net = this.getNetwork();
    const defaultAccount = this.getDefaultAccount();
    const accountsStore = useAccountsStore();
    accountsStore.remove('Zilpay');
    accountsStore.add(
      'Zilpay',
      defaultAccount.base16,
      defaultAccount.bech32,
      [this.zilpayNetToOurNet(net)],
      {
        zilpay: window.zilPay,
      }
    );

    const blockchainStore = useBlockchainStore();
    await blockchainStore.setSelectedAccount('Zilpay');
  }

  private zilpayNetToOurNet(net: string) {
    if (net == 'testnet') {
      return 'Testnet';
    } else if (net === 'mainnet') {
      return 'Mainnet';
    } else {
      return net;
    }
  }

  private getDefaultAccount() {
    const { wallet } = window.zilPay;

    if (!wallet.isConnect || !wallet.isEnable) {
      throw new Error('ZilPay could not be accessed. Please log in.');
    }

    return wallet.defaultAccount;
  }

  async signTx(tx: ZilPayTransaction) {
    await this.test();
    const { blockchain } = window.zilPay;
    const result = await blockchain.createTransaction(tx);
    return result;
  }
  private subscribeToChanges() {
    const { wallet } = window.zilPay;

    if (this.observableNetwork && !this.observableNetwork.isStopped) {
      this.observableNetwork.unsubscribe();
    }

    if (this.observableAccount && !this.observableAccount.isStopped) {
      this.observableAccount.unsubscribe();
    }

    this.observableNetwork = wallet.observableNetwork().subscribe(() => {
      this.updateSelectedNetwork();
      this.updateSelectedAccount();
      console.log('there');
    });
    this.observableAccount = wallet.observableAccount().subscribe(() => {
      console.log('here');
      this.updateSelectedAccount();
    });
  }

  observableNetwork: ObservableNetwork | undefined;
  observableAccount: ObservableAccount | undefined;
}

export const zilpayHelper = new ZilpayHelper();
