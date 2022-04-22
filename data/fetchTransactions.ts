import { Transaction } from "../@types/types";

export async function fetchTransactions(
    account: string, 
    chainId: number
): Promise<Transaction[]> {
    if (chainId !== 1) {
        // TODO: Add support for chains other than ethereum
        throw new Error("Only Ethereum Network is currently supported")
    }

    const response = await fetch(
        `https://api.etherscan.io/api?\
            module=account&\
            action=txlist&\
            address=${account}&\
            startblock=0&\
            endblock=99999999&\
            page=1offset=10&\
            sort=asc&\
            apikey=PVGHK1NRJ1AMDH73RNW8HH95YUNE2EGH6Q`
        )

    const data = await response.json()

    // if (typeof data.result === 'string' || data.result instanceof String) {
    //     return []
    // }

    if (data.result === 'Max rate limit reached, please use API Key for higher rate limit') {
        // TODO: Add error handling that makes sense
        return []
    }

    return data.result
}
