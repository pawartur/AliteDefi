import { Transaction } from "../@types/types";

export async function fetchTransactions(
    account: string, 
    chainId: number
): Promise<Transaction[]> {
    if (chainId !== 1) {
        // TODO: Add support for chains other than ethereum
        throw new Error("Only Ethereum Network is currently supported")
    }
    const apiEndpoint = process.env.NEXT_PUBLIC_ETHERSCAN_MAINNET_API_ENDPOINT
    const apiModule = 'account'
    const apiAction = 'tokentx'
    const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
    const address = '0xaf23170856890340959529125Fb058A61Eb924b3'
    const response = await fetch(`${apiEndpoint}?module=${apiModule}&action=${apiAction}&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=${apiKey}`)
    const data = await response.json()
    if (typeof(data.result) === 'string') {
        // TODO: Add error handling that makes sense
        return []
    }
    
    return data.result
}
