import { TransactionStatusObj } from '@zilliqa-js/core';

export type TransactionStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Rejected'
  | 'Initialized';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const STATUS: any = {
  0: {
    1: {
      status: 'Pending',
      statusMessage: 'Pending - Dispatched',
    },
  },
  1: {
    2: {
      status: 'Pending',
      statusMessage: 'Pending - Soft-confirmed (awaiting Tx block generation)',
    },
    4: {
      status: 'Pending',
      statusMessage: 'Pending - Nonce is higher than expected',
    },
    5: {
      status: 'Pending',
      statusMessage: 'Pending - Microblock gas limit exceeded',
    },
    6: {
      status: 'Pending',
      statusMessage: 'Pending - Consensus failure in network',
    },
  },
  2: {
    3: {
      status: 'Confirmed',
      statusMessage: 'Confirmed',
    },
    10: {
      status: 'Rejected',
      statusMessage: 'Rejected - Transaction caused math error',
    },
    11: {
      status: 'Rejected',
      statusMessage: 'Rejected - Scilla invocation error',
    },
    12: {
      status: 'Rejected',
      statusMessage: 'Rejected - Contract account initialization error',
    },
    13: {
      status: 'Rejected',
      statusMessage: 'Rejected - Invalid source account',
    },
    14: {
      status: 'Rejected',
      statusMessage: 'Rejected - Gas limit higher than shard gas limit',
    },
    15: {
      status: 'Rejected',
      statusMessage: 'Rejected - Unknown transaction type',
    },
    16: {
      status: 'Rejected',
      statusMessage: 'Rejected - Transaction sent to wrong shard',
    },
    17: {
      status: 'Rejected',
      statusMessage: 'Rejected - Contract & source account cross-shard issue',
    },
    18: {
      status: 'Rejected',
      statusMessage: 'Rejected - Code size exceeded limit',
    },
    19: {
      status: 'Rejected',
      statusMessage: 'Rejected - Transaction verification failed',
    },
    20: {
      status: 'Rejected',
      statusMessage: 'Rejected - Gas limit too low',
    },
    21: {
      status: 'Rejected',
      statusMessage: 'Rejected - Insufficient balance',
    },
    22: {
      status: 'Rejected',
      statusMessage: 'Rejected - Insufficient gas to invoke Scilla checker',
    },
    23: {
      status: 'Rejected',
      statusMessage: 'Rejected - Duplicate transaction exists',
    },
    24: {
      status: 'Rejected',
      statusMessage:
        'Rejected - Transaction with same nonce but same/higher gas price exists',
    },
    25: {
      status: 'Rejected',
      statusMessage: 'Rejected - Invalid destination address',
    },
    26: {
      status: 'Rejected',
      statusMessage: 'Rejected - Failed to add contract account to state',
    },
    27: {
      status: 'Rejected',
      statusMessage: 'Rejected - Nonce is lower than expected',
    },
    255: {
      status: 'Rejected',
      statusMessage: 'Rejected - Internal error',
    },
  },
};

export const interpretTransactionStatus = (
  status: TransactionStatusObj
): { status: TransactionStatus; statusMessage: string } => {
  try {
    return STATUS[status.modificationState][status.status];
  } catch (error) {
    return {
      status: 'Initialized',
      statusMessage: 'Initialized',
    };
  }
};
