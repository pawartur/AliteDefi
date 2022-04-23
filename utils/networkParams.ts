export const networkParams:  { [name: string]: {} } = {
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

export const chainIdToAaveSubgraph = {
  1: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2',
  42: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2-kovan',
  137: 'https://api.thegraph.com/subgraphs/name/aave/aave-v2-matic',
}
