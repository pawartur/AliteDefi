import CoinGecko from "coingecko-api";
import {
  Blockchain,
  Transaction
} from "../@types/types";
import { CHAIN_ID_TO_COINGECKO_COIN_ID } from "../utils/apiParams";

export async function fetchNativeTransactionValuesInUSD(
  chainId: number | undefined, 
  transactions: Transaction[]
  ): Promise<{[transactionHash: string]: number}> {
  if (chainId !== undefined) {
    const coinGeckoClient = new CoinGecko();
    let results: {[transactionHash: string]: number} = {}
    const valueQueries = transactions.map((transaction) => {
      const transactionDate = new Date(transaction.timeStamp*1000)
      return coinGeckoClient.coins.fetchHistory(
        CHAIN_ID_TO_COINGECKO_COIN_ID[chainId as Blockchain], 
        {
          date:`${transactionDate.getDate()}-${transactionDate.getMonth()+1}-${transactionDate.getFullYear()}`,
          localization: false
        }
      ).then((response) => {
        const tokenDecimal = transaction.tokenDecimal || 18
        const price = response.data.market_data.current_price.usd
        results[transaction.blockHash] = (transaction.value * price) / Math.pow(10, tokenDecimal)
      });
    })
    await Promise.all(valueQueries)
    return results
  } else {
    return {}
  }
}
