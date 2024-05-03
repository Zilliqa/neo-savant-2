import axios from 'axios';
export const getContractAbi = async (code: string) => {
  // TODO: Fix this hardcoded URL.
  const SCILLA_CHECKER_URL = 'https://scilla-server.zilliqa.com/contract/check';
  const response = await axios.post(SCILLA_CHECKER_URL, {
    code: code,
  });

  if (response.data.result === 'success') {
    const { contract_info } = JSON.parse(response.data.message);

    // FIXME: Use proper type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contract_info.params = contract_info.params.map((item: any) => {
      return {
        ...item,
        value: '',
      };
    });

    return contract_info;
  }
};
