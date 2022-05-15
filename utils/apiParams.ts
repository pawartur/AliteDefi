import { 
  Blockchain,
  ApiUrlsPerChain,
  EtherscanApiParams
 } from "../@types/types";

export const TRANSACTIONS_API_PARAMS: EtherscanApiParams = {
  [Blockchain.EthereumMainnet]: {
    apiUrl: process.env.NEXT_PUBLIC_ETHERSCAN_MAINNET_API_ENDPOINT,
    apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
  },
  [Blockchain.EthereumKovan]: {
    apiUrl: process.env.NEXT_PUBLIC_ETHERSCAN_KOVAN_API_ENDPOINT,
    apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
  },
  [Blockchain.PolygonMainnet]: {
    apiUrl: process.env.NEXT_PUBLIC_POLYGONSCAN_MAINNET_API_ENDPOINT,
    apiKey: process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY
  }
}

export const CHAIN_ID_TO_COINGECKO_COIN_ID = {
  [Blockchain.EthereumMainnet]: "ethereum",
  [Blockchain.EthereumKovan]: "ethereum",
  [Blockchain.PolygonMainnet]: "matic-network",
}

export const AAVE_SUBGRAPHS: ApiUrlsPerChain = {
  [Blockchain.EthereumMainnet]: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2',
  [Blockchain.EthereumKovan]: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2-kovan',
  [Blockchain.PolygonMainnet]: 'https://api.thegraph.com/subgraphs/name/aave/aave-v2-matic',
}

export const CREAM_DATA_URLS: ApiUrlsPerChain = {
  [Blockchain.EthereumMainnet]: 'https://api.cream.finance/api/v1/rates?comptroller=eth',
  [Blockchain.EthereumKovan]: undefined,
  [Blockchain.PolygonMainnet]: 'https://api.cream.finance/api/v1/rates?comptroller=polygon'
}

export const UNISWAP_SUBGRAPHS: ApiUrlsPerChain = {
  [Blockchain.EthereumMainnet]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  [Blockchain.EthereumKovan]: undefined,
  [Blockchain.PolygonMainnet]: 'https://api.thegraph.com/subgraphs/name/zephyrys/uniswap-polygon-but-it-works',
}

export const ADDITIONAL_CHAINS:  { [name: string]: {} } = {
  "0x63564c40": {
    chainId: "0x63564c40",
    rpcUrls: ["https://api.harmony.one"],
    chainName: "Harmony Mainnet",
    nativeCurrency: { name: "ONE", decimals: 18, symbol: "ONE" },
    blockExplorerUrls: ["https://explorer.harmony.one"],
    iconUrls: ["https://harmonynews.one/wp-content/uploads/2019/11/slfdjs.png"]
  },
  "0x89": {
    chainId: "0x89",
    rpcUrls: ["https://polygon-rpc.com"],
    chainName: "Polygon Mainnet",
    nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
    blockExplorerUrl: ["https://polygonscan.com/"],
    iconUrls: ["https://cryptologos.cc/logos/polygon-matic-logo.svg"]
  }
};
