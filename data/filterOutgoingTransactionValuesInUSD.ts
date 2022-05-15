import { Transaction } from "../@types/types"

export function filterOutgoingTransactionValuesInUSD(
  account: string | undefined,
  transactions: Transaction[],
  transactionValuesInUSD: {[transactionHash: string]: number}
): number[] {
  const result:number[] = []

  if (account !== undefined) {
    transactions.map((transaction: Transaction) => {
      if (transaction.to.toLocaleLowerCase() !== account.toLocaleLowerCase()) {
        result.push(transactionValuesInUSD[transaction.blockHash] ?? 0)
      }
    })
  }

  return result
}