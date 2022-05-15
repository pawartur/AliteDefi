import { ApolloClient, InMemoryCache } from "@apollo/client";
import {
  Transaction
} from "../@types/types";
import gql from "graphql-tag";
import { UNISWAP_SUBGRAPHS } from "../utils/apiParams";

export async function fetchERC20TransactionValuesInUSD(
  chainId: number | undefined, 
  transactions: Transaction[]
): Promise<{[transactionHash: string]: number}> {
  if (chainId !== undefined) {
    const uniswapClient = new ApolloClient({
      uri: UNISWAP_SUBGRAPHS[chainId],
      cache: new InMemoryCache()
    })
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
    let results: {[transactionHash: string]: number} = {}
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
        results[transaction.blockHash] = (transaction.value * price) / Math.pow(10, tokenDecimal)
      });
    });
    await Promise.all(incomingValueQueries)
    return results
  } else {
    return {}
  }
}
