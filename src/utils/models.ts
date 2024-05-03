import { Zilliqa } from '@zilliqa-js/zilliqa';

export interface Network {
  name: string;
  url: string;
  chainId: number;
  msgVersion: number;
  zilliqa: Zilliqa;
}

export interface Contract {
  name: string;
  network: string;
  address: string;
}

export interface TransitionCalls {
  [contractAddress: string]: Transition[];
}

export interface Transition {
  txHash: string;
  vname: string;
  result?: string;
}

export interface PendingContract {
  name: string;
  txHash: string;
  network: string;
}

export interface Tag {
  name: string;
  color: string;
}

export interface Account {
  name: string;
  address: string;
  bech32Address: string;
  balance: string;
  balanceRefreshInProgress: boolean;
  account: KeystoreAccount | PrivatekeyAccount;
  networks: string[];
}

export interface KeystoreAccount {
  keystore: string;
  passphrase: string;
}

export interface PrivatekeyAccount {
  privateKey: string;
}

export interface WaitingTransaction {
  id: string;
  network: string;
  statusMessage: string;
  from: string;
  to: string;
  amount: string;
}

export interface ScillaContract {
  name: string;
  code: string;
  fileName?: string;
}
