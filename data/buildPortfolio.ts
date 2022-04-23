import { 
    Portfolio,
    Currency,
    Transaction 
} from "../@types/types";

export function buildPortfolio(
    account: String,
    balance: Number,
    transactions: Transaction[],
    balanceCurrencyPriceInPortfolioCurrency: Number,
    balanceCurrency: Currency,
    portFoliocurrency: Currency
): Portfolio {
    
    const incomingTransfers = transactions.filter((transaction: Transaction) => {
        // if (transaction.to === account.toString()) {
        if (transaction.to.toLocaleLowerCase() === '0xaf23170856890340959529125Fb058A61Eb924b3'.toLocaleLowerCase()) {
            return transaction
        }
    })
    console.log(incomingTransfers)

    return {
        currency: portFoliocurrency,
        balance: balance.valueOf(),
        overallGainLoss: 900000,
        overallGainLossPercentage:(900000/1000000)
    }
}