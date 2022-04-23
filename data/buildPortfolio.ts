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
    return {
        currency: portFoliocurrency,
        balance: balance.valueOf(),
        overallGainLoss: 900000,
        overallGainLossPercentage:(900000/1000000)
    }
}