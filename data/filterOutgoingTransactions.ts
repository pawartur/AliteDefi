import { Transaction } from "../@types/types";

export function filterOutgoingTransactions(
    account: String,
    transactions: Transaction[]
): Transaction[] {
    const incomingTransfers = transactions.filter((transaction: Transaction) => {
        if (transaction.from === account.toString()) {
            return transaction
        }
    })
    return incomingTransfers
}
