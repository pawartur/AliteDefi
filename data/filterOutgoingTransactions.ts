import { Transaction } from "../@types/types";

export function filterOutgoingTransactions(
    account: String,
    transactions: Transaction[]
): Transaction[] {
    const incomingTransfers = transactions.filter((transaction: Transaction) => {
        // if (transaction.from === account.toString()) {
        if (transaction.from.toLocaleLowerCase() === '0xaf23170856890340959529125Fb058A61Eb924b3'.toLocaleLowerCase()) {
            return transaction
        }
    })
    return incomingTransfers
}
