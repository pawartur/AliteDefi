import { ethers } from "ethers";
import { TokenBalance, Transaction } from "../@types/types";
import { fetchERC20BalanceOf } from "./fetchERC20BalanceOf";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { UNISWAP_SUBGRAPHS } from "../utils/apiParams";

export async function fetchAllBalances(
  account: string | undefined,
  chainId: number | undefined,
  erc20Transactions: Transaction[],
  provider: ethers.providers.Web3Provider | undefined
): Promise<TokenBalance[]> {
  if (
    account !== undefined && 
    chainId !== undefined &&
    provider
  ) {
    const uniswapClient = new ApolloClient({
      uri: UNISWAP_SUBGRAPHS[chainId],
      cache: new InMemoryCache()
    })

    const ETH_PRICE_QUERY = gql`
      query bundles {
        bundles(where: { id: "1" }) {
        ethPrice
        }
      }
    `
    const ethPriceData = await uniswapClient.query({
      query: ETH_PRICE_QUERY
    })
    const nativeTokenPriceInUSD = ethPriceData.data.bundles[0].ethPrice

    let result: TokenBalance[] = []
    const nativeTokenAmount = await provider.getBalance(account)
    result.push({
      chainId: chainId,
      symbol: 'ETH', // TODO: Don't hard-code
      amount: Number(nativeTokenAmount),
      decimal: 18,
      priceInUSD: nativeTokenPriceInUSD
    })

    let symbolCache = new Set<string>()
    let symbolToAddr: {[tokenSymbol: string] : string} = {}
    let balanceReqs: Promise<any>[] = [];
    let balances: { [tokenSymbol: string]: number } = {}
    let decimalPlaces: { [tokenSymbol: string]: number } = {}
    erc20Transactions.forEach(async (transaction: Transaction) => {
      if (
        transaction.tokenSymbol !== undefined &&
        transaction.contractAddress !== undefined &&
        transaction.tokenDecimal !== undefined &&
        !symbolCache.has(transaction.tokenSymbol)
      ) {
        symbolToAddr[transaction.tokenSymbol] = transaction.contractAddress
        decimalPlaces[transaction.tokenSymbol] = transaction.tokenDecimal
        symbolCache.add(transaction.tokenSymbol)
        balanceReqs.push(fetchERC20BalanceOf(
            account,
            provider,
            transaction.contractAddress
        ).then((balance) => {
          if (transaction.tokenSymbol) {
            balances[transaction.tokenSymbol] = balance
          }
        }))
      }
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
    const symbolToPrice: {[tokenSymbol: string]:number} = {}
    const valuedBalancePromises: Promise<any>[] = []
    symbolCache.forEach(symbol => {
      valuedBalancePromises.push(
        uniswapClient.query({
          query: gql(latestTokenPriceQuery),
          variables: {
              address: symbolToAddr[symbol]
          }
        }
        ).then((queryResult) => {
          if (queryResult.data.tokenDayDatas.length > 0) {
            symbolToPrice[symbol] = queryResult.data.tokenDayDatas[0].priceUSD
          }
          
        })
      )
    })
    await Promise.all(balanceReqs)
    await Promise.all(valuedBalancePromises)
    Object.keys(balances).forEach((tokenSymbol: string) => {
      if (balances[tokenSymbol] && symbolToPrice[tokenSymbol]) {
        result.push({
          chainId: chainId,
          symbol: tokenSymbol,
          amount: balances[tokenSymbol],
          decimal: decimalPlaces[tokenSymbol],
          priceInUSD:symbolToPrice[tokenSymbol]
        })
      }
    })
    return result;
  } else {
    return []
  }
}
