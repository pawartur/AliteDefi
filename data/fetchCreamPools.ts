export default async function fetchCreamPools(): Promise<any> {

  const stableSymbols = ["USDT", "USDC", "DAI"]

  const poolData = await (await fetch('https://api.cream.finance/api/v1/rates?comptroller=polygon')).json()

  return poolData.lendRates.filter(pool => stableSymbols.includes(pool.tokenSymbol))
}