import {
    Portfolio,
    Currency,
    Transaction,
    TokenBalance
} from "../@types/types";

import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { chainIdToUniswapSubgraph } from "../utils/networkParams";

export async function buildPortfolio(
    account: String,
    chainId: Number, 
    allTokenBalances: TokenBalance[],
    incommingERC20Transactions: Transaction[],
    outgoingERC20Transactions: Transaction[]
): Promise<Portfolio> {
    const uniswapClient = new ApolloClient({
        uri: chainIdToUniswapSubgraph[chainId],
        cache: new InMemoryCache()
    })
    const latestTokenPriceQuery = `
    query TransactionPriceData($address: String!, $timestamp: Int!) {
        tokenDayDatas(where: {token: $address, date_lte: $timestamp}, orderBy: date, orderDirection: desc, first:1) {
            date
            token {
              id
              symbol
            }
            priceUSD
          }
    }
    `

    let incomingTransactionValuesAtTheTimeOfTransaction: Number[] = []
    const incomingValueQueries = incommingERC20Transactions.map((t) => {
        return uniswapClient.query({
            query: gql(latestTokenPriceQuery),
            variables: {
                timestamp: parseInt(t.timeStamp),
                address: t.contractAddress,
            }
        }).then(r => {
            incomingTransactionValuesAtTheTimeOfTransaction.push(
                (Number(t.value) / Math.pow(10, t.tokenDecimal ?? 18)) * (r.data.tokenDayDatas[0]?.priceUSD ?? 0)
            )
        });
    });

    let outgoingTransactionValuesAtTheTimeOfTransaction: Number[] = []
    const outgoingValueQueries = outgoingERC20Transactions.map((t) => {
        return uniswapClient.query({
            query: gql(latestTokenPriceQuery),
            variables: {
                timestamp: parseInt(t.timeStamp),
                address: t.contractAddress,
            }
        }).then(r => {
            outgoingTransactionValuesAtTheTimeOfTransaction.push(
                (Number(t.value) / Math.pow(10, t.tokenDecimal ?? 18)) * (r.data.tokenDayDatas[0]?.priceUSD ?? 0)
            )
        });
    });

    let totalBalance = 0
    allTokenBalances.forEach((tokenBalance: TokenBalance) => {
        totalBalance += (Number(tokenBalance.amount) / Math.pow(10, tokenBalance.decimal)) * tokenBalance.priceInUSD
    })

    await Promise.all(incomingValueQueries)
    const totalIncomingValueInUSD = incomingTransactionValuesAtTheTimeOfTransaction.reduce((acc, n) => {
        return acc + n;
    }, 0)

    await Promise.all(outgoingValueQueries)
    const totalOutgoingValueInUSD = outgoingTransactionValuesAtTheTimeOfTransaction.reduce((acc, n) => {
        return acc + n;
    }, 0)

    const overallGainLoss = totalBalance - totalIncomingValueInUSD + totalOutgoingValueInUSD
    const overallGainLossPercentage = (overallGainLoss / totalBalance) * 100

    return {
        currency: Currency.usd,
        balance: Math.round(totalBalance * 100) / 100,
        overallGainLoss: Math.round(overallGainLoss * 100) / 100,
        overallGainLossPercentage: Math.round(overallGainLossPercentage * 100) / 100
    }
}