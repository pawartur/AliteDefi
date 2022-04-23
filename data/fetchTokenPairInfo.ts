import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const DAI_QUERY = gql`
  query tokens($tokenAddress: Bytes!) {
    tokens(where: { id: $tokenAddress }) {
      derivedETH
      totalLiquidity
    }
  }
`

const ETH_PRICE_QUERY = gql`
  query ethPrice {
    bundle(id: "1") {
      ethPrice
    }
  }
`



const { loading, error, data: ethPriceData } = useQuery(ETH_PRICE_QUERY)
const {
  loading: daiLoading,
  error: daiError,
  data: daiData,
} = useQuery(DAI_QUERY, {
  variables: {
    tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
})

const daiPriceInEth = daiData && daiData.tokens[0].derivedETH
const daiTotalLiquidity = daiData && daiData.tokens[0].totalLiquidity
const ethPriceInUSD = ethPriceData && ethPriceData.bundles[0].ethPrice



