import { CREAM_DATA_URLS } from '../utils/apiParams'

export default async function fetchCreamPools(chainId: number | undefined): Promise<any> {
  if (chainId !== undefined) {
    const dataUrl = CREAM_DATA_URLS[chainId]
    if (dataUrl !== undefined) {
      const stableSymbols = ["ETH", "WETH", "USDC", "DAI", "MATIC"]
      const poolData = await (await fetch(dataUrl)).json()
      return poolData.lendRates.filter((pool: any) => stableSymbols.includes(pool.tokenSymbol))
    } else {
      return []
    }
  } else {
    return []
  }
}