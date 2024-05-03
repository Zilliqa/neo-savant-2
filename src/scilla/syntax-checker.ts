import axios from 'axios';
import { Response } from './checker-response';

export const scillaCheck = async (code: string): Promise<Response> => {
  // TODO: Fix this hardcoded URL.
  const SCILLA_CHECKER_URL = 'https://scilla-server.zilliqa.com/contract/check';

  try {
    const response = await axios.post(SCILLA_CHECKER_URL, {
      code,
    });

    if (response.data.result === 'success') {
      return JSON.parse(response.data.message);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { errors: error.response.data.message };
    } else {
      // TODO: Throw an error
      console.error('Not a valid error from scilla-check');
    }
  }

  return {
    errors: [],
    warnings: [],
  };
};
