import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import fetchAavePools from './fetchAavePools';
import { formatUserSummary } from '@aave/math-utils';
import dayjs from 'dayjs';

const aaveClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/aave/aave-v2-matic',
  cache: new InMemoryCache()
})

export default async function fetchAavePositions(account: string): Promise<any> {
  // https://app.aave.com/markets/?marketName=proto_polygon
  // All queries against polygon V2

  const userReservesQuery = `
  query UserReserves {
      userReserves(where: { user: "0x26609e6c2ab0d93bb244c0f35e18eb821144820a"}) {
        id
        reserve{
          id
          symbol
          underlyingAsset
        }
        user {
          id
        }
        scaledATokenBalance
        usageAsCollateralEnabledOnUser
        stableBorrowRate
        scaledVariableDebt
        principalStableDebt
        stableBorrowLastUpdateTimestamp
      }
  }
  `
  
  const userReservesData = await aaveClient.query({
    query: gql(userReservesQuery)
  })

  const userReserves = userReservesData.data.userReserves.map(userReserve => {
    return {
      ...userReserve,
      underlyingAsset: userReserve.reserve.underlyingAsset,
    };
  });

  const currentTimestamp = dayjs().unix();

  const baseCurrencyQuery = `
  query BaseCurrency {
    priceOracles {
      usdPriceEth
    }
  }
  `

  const priceData = await aaveClient.query({
    query: gql(baseCurrencyQuery)
  })

  const formattedReserves = await fetchAavePools();

  return formatUserSummary({
    currentTimestamp,
    userReserves,
    formattedReserves,
    marketReferenceCurrencyDecimals: 18,
    marketReferencePriceInUsd: (1 / (parseInt(priceData.data.priceOracles[0].usdPriceEth) / (10 ** 18))).toString(),
    userEmodeCategoryId: 0,
  });
}