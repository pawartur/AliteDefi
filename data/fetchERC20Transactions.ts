import { Transaction } from "../@types/types";
import { apiParams } from "../utils/apiParams";

export async function fetchERC20Transactions(
    account: string, 
    chainId: number
): Promise<Transaction[]> {
    const apiEndpoint = apiParams[chainId].apiURL
    const apiKey = apiParams[chainId].apiKey
    console.log('apiEndpoint', apiEndpoint)
    const apiModule = 'account'
    const apiAction = 'tokentx'
    const response = await fetch(`${apiEndpoint}?module=${apiModule}&action=${apiAction}&address=${account}&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=${apiKey}`)
    const data = await response.json()
    if (typeof(data.result) === 'string') {
        // TODO: Add error handling that makes sense
        return []
    }
    
    return data.result
}
