import { Transaction } from "../@types/types";

export async function fetchNativeTokenBalance(
    account: string,
    chainId: number
): Promise<Number> {
    if (chainId !== 1) {
        // TODO: Add support for chains other than ethereum
        throw new Error("Only Ethereum Network is currently supported")
    }
    const apiEndpoint = process.env.NEXT_PUBLIC_ETHERSCAN_MAINNET_API_ENDPOINT
    const apiModule = 'account'
    const apiAction = 'balance'
    const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
    const response = await fetch(`${apiEndpoint}?module=${apiModule}&action=${apiAction}&address=${account}&tag=latest&apikey=${apiKey}`)
    const data = await response.json()
    if (data.result === 'Max rate limit reached, please use API Key for higher rate limit') {
        // TODO: Add error handling that makes sense
        return 0
    }
    // TODO: Return balance in native chain token, but add better normalisation
    // This is for ETH, as etherscan balance is returned in wei (https://docs.etherscan.io/api-endpoints/accounts#get-ether-balance-for-a-single-address)
    return data.result
}
