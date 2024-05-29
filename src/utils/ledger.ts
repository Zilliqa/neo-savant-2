import { TxParams } from '@zilliqa-js/account';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import BluetoothTransport from '@ledgerhq/hw-transport-web-ble';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import Transport from '@ledgerhq/hw-transport';
import { BN, Long } from '@zilliqa-js/util';
import { encodeTransactionProto } from '@zilliqa-js/account/dist/cjs/src/util';

const CLA = 0xe0;
const INS = {
  getVersion: 0x01,
  getPublickKey: 0x02,
  getPublicAddress: 0x02,
  signTxn: 0x04,
  signHash: 0x08,
};

const PubKeyByteLen = 33;
const SigByteLen = 64;
const HashByteLen = 32;
// https://github.com/Zilliqa/Zilliqa/wiki/Address-Standard#specification
const Bech32AddrLen = 'zil'.length + 1 + 32 + 6;

export enum LedgerTransportType {
  WebUSB,
  WebHID,
  Bluetooth,
}

export class LedgerHelper {
  static async isTransportSupported(
    transportType: LedgerTransportType
  ): Promise<boolean> {
    switch (transportType) {
      case LedgerTransportType.Bluetooth:
        return BluetoothTransport.isSupported();

      case LedgerTransportType.WebHID:
        return TransportWebHID.isSupported();

      case LedgerTransportType.WebUSB:
        return TransportWebUSB.isSupported();

      default:
        throw new Error(`${transportType} is not a supported transport type.`);
    }
  }

  async connect(transportType: LedgerTransportType) {
    switch (transportType) {
      case LedgerTransportType.Bluetooth:
        this.ledgerInterface = new LedgerInterface(
          await BluetoothTransport.create()
        );
        break;

      case LedgerTransportType.WebHID:
        this.ledgerInterface = new LedgerInterface(
          await TransportWebHID.create()
        );
        break;

      case LedgerTransportType.WebUSB:
        this.ledgerInterface = new LedgerInterface(
          await TransportWebUSB.create()
        );
        break;

      default:
        throw new Error(`${transportType} is not a supported transport type.`);
        break;
    }
  }

  async signTx(txParams: TxParams) {
    if (this.ledgerInterface) {
      return this.ledgerInterface.signTxn(0, txParams);
    } else {
      throw new Error('Ledger is not initialized.');
    }
  }

  disconnect() {
    return;
  }

  ledgerInterface: LedgerInterface | undefined;
}

class LedgerInterface {
  constructor(transport: Transport, scrambleKey = 'w0w') {
    this.transport = transport;
    transport.setExchangeTimeout(180000);
    transport.decorateAppAPIMethods(
      this,
      ['getVersion', 'getPublicKey', 'getPublicAddress', 'signHash', 'signTxn'],
      scrambleKey
    );
  }

  async getVersion() {
    const P1 = 0x00;
    const P2 = 0x00;

    const response = await this.transport.send(CLA, INS.getVersion, P1, P2);
    let version = 'v';
    for (let i = 0; i < 3; ++i) {
      version += parseInt('0x' + response[i]);
      if (i !== 2) {
        version += '.';
      }
    }
    return { version };
  }

  async getPublicKey(index: number) {
    const P1 = 0x00;
    const P2 = 0x00;

    const payload = Buffer.alloc(4);
    payload.writeInt32LE(index);

    const response = await this.transport.send(
      CLA,
      INS.getPublickKey,
      P1,
      P2,
      payload
    );
    // The first PubKeyByteLen bytes are the public address.
    const publicKey = response.toString('hex').slice(0, PubKeyByteLen * 2);
    return { publicKey };
  }

  async getPublicAddress(index: number) {
    const P1 = 0x00;
    const P2 = 0x01;

    const payload = Buffer.alloc(4);
    payload.writeInt32LE(index);

    const response = await this.transport.send(
      CLA,
      INS.getPublicAddress,
      P1,
      P2,
      payload
    );
    // After the first PubKeyByteLen bytes, the remaining is the bech32 address string.
    const pubAddr = response
      .slice(PubKeyByteLen, PubKeyByteLen + Bech32AddrLen)
      .toString('utf-8');
    const publicKey = response.toString('hex').slice(0, PubKeyByteLen * 2);
    return { pubAddr, publicKey };
  }

  async signHash(keyIndex: number, hashStr: string) {
    const P1 = 0x00;
    const P2 = 0x00;
    const indexBytes = Buffer.alloc(4);
    indexBytes.writeInt32LE(keyIndex);
    const hashBytes = Buffer.from(hashStr, 'hex');
    const hashLen = hashBytes.length;
    if (hashLen <= 0) {
      throw Error(`Hash length ${hashLen} is invalid`);
    }
    if (hashLen > HashByteLen) {
      hashBytes.slice(0, HashByteLen);
    }
    const payload = Buffer.concat([indexBytes, hashBytes]);
    const response = await this.transport.send(
      CLA,
      INS.signHash,
      P1,
      P2,
      payload
    );
    return { sig: response.toString('hex').slice(0, SigByteLen * 2) };
  }

  signTxn(keyIndex: number, txnParams: TxParams) {
    // https://github.com/Zilliqa/Zilliqa-JavaScript-Library/tree/dev/packages/zilliqa-js-account#interfaces
    const P1 = 0x00;
    const P2 = 0x00;

    const indexBytes = Buffer.alloc(4);
    indexBytes.writeInt32LE(keyIndex);

    // Convert to Zilliqa types
    if (!(txnParams.amount instanceof BN)) {
      txnParams.amount = new BN(txnParams.amount);
    }

    if (!(txnParams.gasPrice instanceof BN)) {
      txnParams.gasPrice = new BN(txnParams.gasPrice);
    }

    if (!(txnParams.gasLimit instanceof Long)) {
      txnParams.gasLimit = Long.fromNumber(txnParams.gasLimit);
    }

    let txnBytes = encodeTransactionProto(txnParams);
    // const message = JSON.stringify({ "Encoded transaction": txnBytes.toString('hex') }, null, 2);
    // console.log(chalk.green(message));

    const STREAM_LEN = 128; // Stream in batches of STREAM_LEN bytes each.
    let txn1Bytes;
    if (txnBytes.length > STREAM_LEN) {
      txn1Bytes = txnBytes.slice(0, STREAM_LEN);
      txnBytes = txnBytes.slice(STREAM_LEN, undefined);
    } else {
      txn1Bytes = txnBytes;
      txnBytes = Buffer.alloc(0);
    }

    const txn1SizeBytes = Buffer.alloc(4);
    txn1SizeBytes.writeInt32LE(txn1Bytes.length);
    const hostBytesLeftBytes = Buffer.alloc(4);
    hostBytesLeftBytes.writeInt32LE(txnBytes.length);
    // See signTxn.c:handleSignTxn() for sequence details of payload.
    // 1. 4 bytes for indexBytes.
    // 2. 4 bytes for hostBytesLeftBytes.
    // 3. 4 bytes for txn1SizeBytes (number of bytes being sent now).
    // 4. txn1Bytes of actual data.
    const payload = Buffer.concat([
      indexBytes,
      hostBytesLeftBytes,
      txn1SizeBytes,
      txn1Bytes,
    ]);

    const transport = this.transport;
    return (
      transport
        .send(CLA, INS.signTxn, P1, P2, payload)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(function cb(response): any {
          // Keep streaming data into the device till we run out of it.
          // See signTxn.c:istream_callback() for how this is used.
          // Each time the bytes sent consists of:
          //  1. 4-bytes of hostBytesLeftBytes.
          //  2. 4-bytes of txnNSizeBytes (number of bytes being sent now).
          //  3. txnNBytes of actual data.
          if (txnBytes.length > 0) {
            let txnNBytes;
            if (txnBytes.length > STREAM_LEN) {
              txnNBytes = txnBytes.slice(0, STREAM_LEN);
              txnBytes = txnBytes.slice(STREAM_LEN, undefined);
            } else {
              txnNBytes = txnBytes;
              txnBytes = Buffer.alloc(0);
            }

            const txnNSizeBytes = Buffer.alloc(4);
            txnNSizeBytes.writeInt32LE(txnNBytes.length);
            hostBytesLeftBytes.writeInt32LE(txnBytes.length);
            const payload = Buffer.concat([
              hostBytesLeftBytes,
              txnNSizeBytes,
              txnNBytes,
            ]);
            // Except for the payload, all others are ignored in the device.
            // Only for the first send above will those paramters matter.
            return transport.send(CLA, INS.signTxn, P2, P2, payload).then(cb);
          }
          return response;
        })
        .then((result) => {
          return { sig: result.toString('hex').slice(0, SigByteLen * 2) };
        })
    );
  }
  transport: Transport;
}

export const ledgerHelper = new LedgerHelper();
