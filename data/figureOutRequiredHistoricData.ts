import { Transaction } from "../@types/types";

export function figureOutRequiredHistoricData(
    transactions: Transaction[]
): any {
    let result: { [tokenSymbol: string]: number[] } = {}

    transactions.forEach((transaction: Transaction) => {
        if (result[transaction.tokenSymbol] === undefined) {
            result[transaction.tokenSymbol] = []
        }
        result[transaction.tokenSymbol].push(transaction.timeStamp)
    })

    return result
}