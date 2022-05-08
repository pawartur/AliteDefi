export enum Blockchain {
  EthereumMainnet = 1,
  EthereumKovan = 42,
  PolygonMainnet = 137
}

export type ApiUrlsPerChain = { [chainId in Blockchain | number]: string | undefined}

export type EtherscanApiParams = {
  [chainId in Blockchain | number] : {
    apiKey: string | undefined,
    apiUrl: string | undefined
  } | undefined
}

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

export enum LiquidityProtocol {
  Aave = 'aave',
  Cream = 'cream'
}

export type LiquidityPools = {
  protocol: LiquidityProtocol,
  tokenSymbol: string;
  supplyAPY: number;
}

export type ChainInfoModel = {
  portfolio: Portfolio | null;
  liquidityPools: { 
    [protocol in LiquidityProtocol]: LiquidityPools[]
  };
}

export {}
