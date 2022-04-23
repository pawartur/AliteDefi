import {
    Portfolio,
    Currency,
    Transaction,
    TokenBalance
} from "../@types/types";

import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export async function buildPortfolio(
    account: String,
    allTokenBalances: TokenBalance[],
    incommingERC20Transactions: Transaction[],
): Promise<Portfolio> {
    const uniswapClient = new ApolloClient({
        uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
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
    const valueQueries = incommingERC20Transactions.map((t) => {
        return uniswapClient.query({
            query: gql(latestTokenPriceQuery),
            variables: {
                timestamp: parseInt(t.timeStamp),
                address: t.contractAddress,
            }
        });
    });

    const totalIncomingValueInUSD = (await Promise.all(valueQueries)).reduce((acc, n) => {
        console.log('iter', n)
        return acc + (n.data.tokenDayDatas[0]?.priceUSD ?? 0);
    }, 0)
    console.log('dem valiues', totalIncomingValueInUSD);

    let totalBalance = 0
    allTokenBalances.forEach((tokenBalance: TokenBalance) => {
        console.log('tokenBalance.symbol', tokenBalance.symbol)
        console.log('tokenBalance.amount', tokenBalance.amount)
        console.log('tokenBalance.priceInUSD', tokenBalance.priceInUSD)
        totalBalance += (Number(tokenBalance.amount) / Math.pow(10, tokenBalance.decimal)) * tokenBalance.priceInUSD
    })
    console.log('totalBalance', totalBalance)

    const overallGainLoss = totalBalance - totalIncomingValueInUSD
    const overallGainLossPercentage = (overallGainLoss / totalBalance) * 100

    return {
        currency: Currency.usd,
        balance: Math.round(totalBalance * 100) / 100,
        overallGainLoss: Math.round(overallGainLoss * 100) / 100,
        overallGainLossPercentage: Math.round(overallGainLossPercentage * 100) / 100
    }
}