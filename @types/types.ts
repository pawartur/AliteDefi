export type Transaction = {
    timeStamp: number;
    transactionIndex: number;
    from: string;
    to: string;
    tokenName?: string;
    tokenSymbol?: string;
    tokenDecimal?: number;
    value: number;
    gas: number;
    gasUsed: number;
    gasPrice: number;
    contractAddress?: string;
};

export enum Currency {
    usd = "USD",
    eth = "ETH"
}

export type TokenBalance = {
    chainId: number;
    symbol: string;
    amount: number;
    decimal: number;
    priceInUSD: number;
}

export type Portfolio = {
    currency: Currency;
    balance: number;
    allTokenBalances: TokenBalance[];
    overallGainLoss: number;
    overallGainLossPercentage: number;
}

export {}
