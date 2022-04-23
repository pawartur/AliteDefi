import { ethers } from "ethers";
import { TokenBalance, Transaction } from "../@types/types";
import { fetchERC20BalanceOf } from "./fetchERC20BalanceOf";
import { fetchERC20Transactions } from "./fetchERC20Transactions";
import { fetchNativeTokenBalance } from "./fetchNativeTokenBalance";

export async function fetchAllBalances(
    account: string, 
    chainId: number,
    nativeTokenPriceInUSD: number,
    erc20Transactions: Transaction[],
    provider: ethers.providers.Web3Provider
): Promise<TokenBalance[]> {
    let result: TokenBalance[] = []
    const nativeTokenAmount = await fetchNativeTokenBalance(account, chainId)
    result.push({
        chainId: chainId,
        symbol:'ETH', // TODO: Don't hard-code
        amount: nativeTokenAmount.valueOf(),
        priceInUSD: nativeTokenPriceInUSD
    })

    let symbolCache = new Set<string>()
    erc20Transactions.forEach(async (transaction: Transaction) => {
        if (!symbolCache.has(transaction.tokenSymbol)) {
            symbolCache.add(transaction.tokenSymbol)
            const erc20TokenAmount = await fetchERC20BalanceOf(
                account, 
                provider, 
                transaction.contractAddress
            )
            result.push({
                chainId: chainId,
                symbol: transaction.tokenSymbol,
                amount: erc20TokenAmount,
                // TODO: Store the list of supported stable coins somewhere (as we also use it e.g. in our call to Aave)
                priceInUSD: ["USDC", "USDT", "DAI"].some((tokenSymbol: string) => {
                    return transaction.tokenSymbol === tokenSymbol
                }) ? 1 : 0 // TODO: Get the prices
            })
        }
    })

    return result
}