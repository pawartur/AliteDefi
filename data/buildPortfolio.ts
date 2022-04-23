import { 
    Portfolio,
    Currency,
    Transaction 
} from "../@types/types";

export function buildPortfolio(
    balance: Number,
    transactions: Transaction[],
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