import { ethers } from "ethers";
import { TokenBalance, Transaction } from "../@types/types";
import { fetchERC20BalanceOf } from "./fetchERC20BalanceOf";
import { fetchERC20Transactions } from "./fetchERC20Transactions";
import { fetchNativeTokenBalance } from "./fetchNativeTokenBalance";

import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
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
        symbol: 'ETH', // TODO: Don't hard-code
        amount: nativeTokenAmount.valueOf(),
        priceInUSD: nativeTokenPriceInUSD
    })

    let symbolCache = new Set<string>()
    let symbolToAddr = {}
    let balanceReqs = [];
    let balances: { [tokenSymbol: string]: number } = {};
    erc20Transactions.forEach(async (transaction: Transaction) => {
        if (!symbolCache.has(transaction.tokenSymbol)) {
            symbolToAddr[transaction.tokenSymbol] = transaction.contractAddress
            symbolCache.add(transaction.tokenSymbol)
            balanceReqs.push(fetchERC20BalanceOf(
                account,
                provider,
                transaction.contractAddress
            ).then((v) => balances[transaction.tokenSymbol] = v))
        }
    })
    const uniswapClient = new ApolloClient({
        uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
        cache: new InMemoryCache()
    })
    const latestTokenPriceQuery = `
    query LatestPriceData($address: String!) {
        tokenDayDatas(where: {token: $address}, orderBy: date, orderDirection: desc, first:1) {
            date
            token {
              id
              symbol
            }
            priceUSD
          }
    }
    `
    const symbolToPrice: { [tokenSymbol: string]: number } = {}
    const valuedBalancePromises = []
    symbolCache.forEach(symbol => {
        valuedBalancePromises.push(
            uniswapClient.query({
                query: gql(latestTokenPriceQuery),
                variables: {
                    address: symbolToAddr[symbol]
                }
            }
            ).then((v) => { symbolToPrice[symbol] = v })
        )
    })
    console.log('wat', valuedBalancePromises)
    let resolvedBalances = await Promise.all(balanceReqs)
    const latestPrices = await Promise.all(valuedBalancePromises)
    Object.keys(balances).forEach((tokenSymbol: string) => {
        result.push({
            chainId: chainId,
            symbol: tokenSymbol,
            amount: balances[tokenSymbol],
            priceInUSD:symbolToPrice[tokenSymbol]
        })
    })

    console.log('prices', symbolToPrice)
    return result;
}