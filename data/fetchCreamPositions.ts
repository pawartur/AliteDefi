import { chainIdToCreamDataURL } from "../utils/networkParams"

export default async function fetchCreamPositions(account: string, chainId: Number | undefined): Promise<any> {
  // https://api.cream.finance/api/documentations/#/default/CTokenController_rates

  const stableSymbols = ["ETH", "USDC", "DAI", "MATIC"]
  
  if (chainId === undefined || chainIdToCreamDataURL[chainId] === undefined) {
    return [];
  }

  const baseURL = chainIdToCreamDataURL[chainId]
  const positionData = await (await fetch(`${baseURL}&addresses=${account.toLowerCase()}`)).json()

  console.log(positionData)
  // this seems to be a bit stale and probbly not reliable
  return positionData
}