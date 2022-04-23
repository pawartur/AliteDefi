import { Transaction } from "../@types/types";

export function filterIncomingTransactions(
    account: String,
    transactions: Transaction[]
): Transaction[] {
    const incomingTransfers = transactions.filter((transaction: Transaction) => {
        // if (transaction.to === account.toString()) {
        if (transaction.to.toLocaleLowerCase() === account.toLocaleLowerCase()) {
            return transaction
        }
    })
    return incomingTransfers
}
