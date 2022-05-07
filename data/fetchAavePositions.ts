import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import fetchAavePools from './fetchAavePools';
import { formatUserSummary } from '@aave/math-utils';
import dayjs from 'dayjs';
import { AAVE_SUBGRAPHS } from '../utils/apiParams';

export default async function fetchAavePositions(account: string, chainId: number): Promise<any> {
  // https://app.aave.com/markets/?marketName=proto_polygon
  // All queries against polygon V2
  const aaveClient = new ApolloClient({
    uri: AAVE_SUBGRAPHS[chainId],
    cache: new InMemoryCache()
  })

  const userReservesQuery = `
  query UserReserves($user: String!) {
      userReserves(where: { user: $user}) {
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
    query: gql(userReservesQuery),
    variables: {
      user: account
    }
  })

  const userReserves = userReservesData.data.userReserves.map((userReserve: any) => {
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

  const formattedReserves = await fetchAavePools(chainId);

  return formatUserSummary({
    currentTimestamp,
    userReserves,
    formattedReserves,
    marketReferenceCurrencyDecimals: 18,
    marketReferencePriceInUsd: (1 / (parseInt(priceData.data.priceOracles[0].usdPriceEth) / (10 ** 18))).toString(),
    userEmodeCategoryId: 0,
  });
}