import {
  Transaction
} from "../@types/types";

export async function fetchNativeTransactionValuesInUSD(
  chainId: number | undefined, 
  transactions: Transaction[]
  ): Promise<{[transactionHash: string]: number}> {
  if (chainId !== undefined) {
    return {}
  } else {
    return {}
  }
}
