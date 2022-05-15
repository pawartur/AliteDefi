import {
    Portfolio,
    Currency,
    Transaction,
    TokenBalance
} from "../@types/types";

import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { UNISWAP_SUBGRAPHS } from "../utils/apiParams";

export function buildPortfolio(
  chainId: number | undefined, 
  allTokenBalances: TokenBalance[],
  incomingTransactionValuesInUSD: number[],
  outgoingTransactionValuesInUSD: number[]
): Portfolio | null {
  if (chainId !== undefined) {
    const uniswapClient = new ApolloClient({
      uri: UNISWAP_SUBGRAPHS[chainId],
      cache: new InMemoryCache()
    })
    let totalBalance = 0
    allTokenBalances.forEach((tokenBalance: TokenBalance) => {
        totalBalance += (Number(tokenBalance.amount) / Math.pow(10, tokenBalance.decimal)) * tokenBalance.priceInUSD
    })

    const totalIncomingValueInUSD = incomingTransactionValuesInUSD.reduce((acc, n) => {
        return acc + n;
    }, 0)

    const totalOutgoingValueInUSD = outgoingTransactionValuesInUSD.reduce((acc, n) => {
        return acc + n;
    }, 0)

    const overallGainLoss = totalBalance - totalIncomingValueInUSD + totalOutgoingValueInUSD
    const overallGainLossPercentage = (overallGainLoss / totalBalance) * 100

    return {
        currency: Currency.usd,
        balance: Math.round(totalBalance * 100) / 100,
        allTokenBalances: allTokenBalances,
        overallGainLoss: Math.round(overallGainLoss * 100) / 100,
        overallGainLossPercentage: Math.round(overallGainLossPercentage * 100) / 100
    }
  } else {
    return null
  }

}