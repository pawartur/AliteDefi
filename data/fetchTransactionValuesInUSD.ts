import { ApolloClient, InMemoryCache } from "@apollo/client";
import {
  Transaction
} from "../@types/types";
import gql from "graphql-tag";
import { UNISWAP_SUBGRAPHS } from "../utils/apiParams";

export async function fetchTransactionValuesInUSD(
  chainId: number | undefined, 
  transactions: Transaction[]
): Promise<number[]> {
  if (chainId !== undefined) {
    const uniswapClient = new ApolloClient({
      uri: UNISWAP_SUBGRAPHS[chainId],
      cache: new InMemoryCache()
    })
    // FIXME: It seems that this query returns empty results for native tokens (at least it returns empty results for my eth transactions on ethereum)
    const transactionTokenPriceQuery = `
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
    let results: number[] = []
    const incomingValueQueries = transactions.map((transaction) => {
      return uniswapClient.query({
        query: gql(transactionTokenPriceQuery),
        variables: {
            timestamp: Number(transaction.timeStamp),
            address: transaction.contractAddress,
        }
      }).then((queryResult) => {
        const tokenDecimal = transaction.tokenDecimal || 18
        const price = queryResult.data.tokenDayDatas[0]?.priceUSD || 0
        console.log('queryResult', queryResult)
        console.log('transaction.value', transaction.value)
        console.log('price', price)
        console.log('tokenDecimal', tokenDecimal)
        console.log('value in usd', tokenDecimal)
        results.push((transaction.value * price) / Math.pow(10, tokenDecimal))
      });
    });
    await Promise.all(incomingValueQueries)
    return results
  } else {
    return []
  }
}
