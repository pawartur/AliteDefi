import { chainIdToCreamDataURL } from '../utils/networkParams'

export default async function fetchCreamPools(chainId: Number | undefined): Promise<any> {
  if (chainId === undefined || chainIdToCreamDataURL[chainId] === undefined) {
    return [];
  }

  const stableSymbols = ["USDT", "USDC", "DAI"]

  const poolData = await (await fetch(chainIdToCreamDataURL[chainId])).json()

  return poolData.lendRates.filter(pool => stableSymbols.includes(pool.tokenSymbol))
}