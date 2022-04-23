import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { formatReserves, ReserveDataWithPrice } from '@aave/math-utils';
import dayjs from 'dayjs';

const aaveClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2',
  cache: new InMemoryCache()
})

export default async function fetchAavePools(): Promise<any> {
  // https://app.aave.com/markets/?marketName=proto_polygon
  // All queries against polygon V2
  const stableCoinPoolQuery = `
  query AavePools {
    reserves(where: {symbol_in: ["USDC", "DAI", "USDT"]}) {
    id
    symbol
    name
    decimals
    underlyingAsset
    usageAsCollateralEnabled
    reserveFactor
    baseLTVasCollateral
    averageStableRate
    stableDebtLastUpdateTimestamp
    liquidityIndex
    reserveLiquidationThreshold
    reserveLiquidationBonus
    variableBorrowIndex
    variableBorrowRate
    liquidityRate
    totalPrincipalStableDebt
    totalScaledVariableDebt
    lastUpdateTimestamp
    availableLiquidity
    stableBorrowRate
    totalLiquidity
    price {
      priceInEth
    }
  }
  }
  `

  const baseCurrencyQuery = `
  query BaseCurrency {
    priceOracles {
      usdPriceEth
    }
  }
  `
  const poolQuery = aaveClient.query({
    query: gql(stableCoinPoolQuery)
  })

  const priceQuery = aaveClient.query({
    query: gql(baseCurrencyQuery)
  })

  let priceData, poolData;
  [priceData, poolData] = await Promise.all([priceQuery, poolQuery])

  const reserves = poolData.data.reserves.map(reserve => {
    return {
      ...reserve,
      priceInMarketReferenceCurrency: reserve.price.priceInEth,
      eModeCategoryId: 0,
      borrowCap: '',
      supplyCap: '',
      debtCeiling: '',
      debtCeilingDecimals: 0,
      isolationModeTotalDebt: '',
      eModeLtv: 0,
      eModeLiquidationThreshold: 0,
      eModeLiquidationBonus: 0,
    };
  });

  const currentTimestamp = dayjs().unix();

  /*
  - @param `reserves` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.reservesArray`
  - @param `currentTimestamp` Current UNIX timestamp in seconds
  - @param `marketReferencePriceInUsd` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferencePriceInUsd`
  - @param `marketReferenceCurrencyDecimals` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferenceCurrencyDecimals`
  */

  // Docs: https://github.com/aave/aave-utilities#subgraph
  return formatReserves({
    reserves,
    currentTimestamp,
    marketReferenceCurrencyDecimals: 18,
    marketReferencePriceInUsd: (1 / (parseInt(priceData.data.priceOracles[0].usdPriceEth) / (10 ** 18))).toString(),
  });
}