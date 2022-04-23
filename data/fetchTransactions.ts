import { Transaction } from "../@types/types";

export async function fetchTransactions(
    account: string, 
    chainId: number
): Promise<Transaction[]> {
    if (chainId !== 1) {
        // TODO: Add support for chains other than ethereum
        throw new Error("Only Ethereum Network is currently supported")
    }
    const apiEndpoint = 'https://api.etherscan.io/api'
    const apiModule = 'account'
    const apiAction = 'txList'
    const apiKey = 'PVGHK1NRJ1AMDH73RNW8HH95YUNE2EGH6Q'
    const response = await fetch(`${apiEndpoint}?module=${apiModule}&action=${apiAction}&address=${account}&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=${apiKey}`)
    const data = await response.json()
    if (data.result === 'Max rate limit reached, please use API Key for higher rate limit') {
        // TODO: Add error handling that makes sense
        return []
    }
    return data.result
}
