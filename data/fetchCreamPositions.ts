export default async function fetchCreamPositions(account: string): Promise<any> {
  // https://api.cream.finance/api/documentations/#/default/CTokenController_rates

  const stableSymbols = ["USDT", "USDC", "DAI"]

  const positionData = await (await fetch(`https://api.cream.finance/api/v1/account?comptroller=polygon&addresses=${account.toLowerCase()}`)).json()

  console.log(positionData)

  // this seems to be a bit stale and probbly not reliable
  return positionData
}