import { Transaction } from "../@types/types";

export function filterIncomingTransactions(
    account: String,
    transactions: Transaction[]
): Transaction[] {
    const incomingTransfers = transactions.filter((transaction: Transaction) => {
        // if (transaction.to === account.toString()) {
        if (transaction.to.toLocaleLowerCase() === '0xaf23170856890340959529125Fb058A61Eb924b3'.toLocaleLowerCase()) {
            return transaction
        }
    })
    return incomingTransfers
}
