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
    let totalIncomingValueInUSD = 0
    transactions.forEach((transaction: Transaction) => {
        // TODO: Store the list of supported stable coins somewhere (as we also use it e.g. in our call to Aave)
        if (["USDC", "USDT", "DAI"].some((tokenSymbol: string) => {
            return transaction.tokenSymbol === tokenSymbol
        })) {
            totalIncomingValueInUSD +=  (Number(transaction.value) / Math.pow(10, transaction.tokenDecimal))
        }
    })
    const balanceValue = balance.valueOf() * (balanceCurrencyPriceInPortfolioCurrency || 0).valueOf()
    const overallGainLoss = balanceValue - totalIncomingValueInUSD
    const overallGainLossPercentage = (overallGainLoss/balanceValue)*100

    return {
        currency: portFoliocurrency,
        balance: Math.round(balanceValue * 100) / 100,
        overallGainLoss: Math.round(overallGainLoss * 100) / 100,
        overallGainLossPercentage: Math.round(overallGainLossPercentage * 100) / 100
    }
}