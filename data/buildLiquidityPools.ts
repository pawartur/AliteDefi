import { LiquidityPools, LiquidityProtocol } from "../@types/types";

export function buildLiquidityPoolsFromAaveData(data: any[]): LiquidityPools[] {
  let result: LiquidityPools[] = []
  data.map((pool) => {
    result.push({
      protocol: LiquidityProtocol.Aave,
      tokenSymbol: pool.symbol,
      supplyAPY: pool.supplyAPY
    })
  })
  return result
}

export function buildLiquidityPoolsFromCreamData(data: any[]): LiquidityPools[] {
  let result: LiquidityPools[] = []
  data.map((pool) => {
    result.push({
      protocol: LiquidityProtocol.Cream,
      tokenSymbol: pool.tokenSymbol,
      supplyAPY: pool.apy
    })
  })
  return result
}
