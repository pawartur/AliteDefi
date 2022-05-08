import { Transaction } from "../@types/types";
import { TRANSACTIONS_API_PARAMS } from "../utils/apiParams";

export async function fetchERC20Transactions(
    account: string | undefined, 
    chainId: number | undefined
): Promise<Transaction[]> {
  if (
    account !== undefined && 
    chainId !== undefined && 
    TRANSACTIONS_API_PARAMS[chainId] !== undefined
  ) {
    const apiEndpoint= TRANSACTIONS_API_PARAMS[chainId]?.apiUrl
    const apiKey = TRANSACTIONS_API_PARAMS[chainId]?.apiKey
    const apiModule = 'account'
    const apiAction = 'tokentx'
    const response = await fetch(`${apiEndpoint}?module=${apiModule}&action=${apiAction}&address=${account}&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=${apiKey}`)
    const data = await response.json()
    if (typeof(data.result) === 'string') {
        // TODO: Add error handling that makes sense
        return []
    }
    return data.result
  } else {
    return []
  }

}
