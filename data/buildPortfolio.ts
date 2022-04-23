import { 
    Portfolio,
    Currency,
    Transaction, 
    TokenBalance
} from "../@types/types";

export function buildPortfolio(
    account: String,
    allTokenBalances: TokenBalance[],
    incommingERC20Transactions: Transaction[],
): Portfolio {
    let totalIncomingValueInUSD = 0
    incommingERC20Transactions.forEach((transaction: Transaction) => {
        // TODO: Store the list of supported stable coins somewhere (as we also use it e.g. in our call to Aave)
        if (["USDC", "USDT", "DAI"].some((tokenSymbol: string) => {
            return transaction.tokenSymbol === tokenSymbol
        })) {
            totalIncomingValueInUSD +=  (Number(transaction.value) / Math.pow(10, transaction.tokenDecimal))
        }
    })

    let totalBalance = 0
    allTokenBalances.forEach((tokenBalance: TokenBalance) => {
        totalBalance += tokenBalance.amount * tokenBalance.priceInUSD
    })

    const overallGainLoss = totalBalance - totalIncomingValueInUSD
    const overallGainLossPercentage = (overallGainLoss/totalBalance)*100

    return {
        currency: Currency.usd,
        balance: Math.round(totalBalance * 100) / 100,
        overallGainLoss: Math.round(overallGainLoss * 100) / 100,
        overallGainLossPercentage: Math.round(overallGainLossPercentage * 100) / 100
    }
}