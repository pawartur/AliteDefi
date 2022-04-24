import
React,
{
  useContext,
  useEffect,
  useState
} from "react";

import ConnectionContext from "../utils/ConnectionContext";
import {
  Transaction,
  Portfolio,
  Currency,
  TokenBalance
} from "../@types/types";
import { fetchERC20Transactions } from "../data/fetchERC20Transactions";
import { fetchNativeTokenBalance } from "../data/fetchNativeTokenBalance";
import { buildPortfolio } from "../data/buildPortfolio";

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { apolloClient } from "../pages";
import { filterIncomingTransactions } from "../data/filterIncomingTransactions";
import { figureOutRequiredHistoricData } from "../data/figureOutRequiredHistoricData";
import { fetchAllBalances } from "../data/fetchAllBalances";
import { filterOutgoingTransactions } from "../data/filterOutgoingTransactions";
import { fetchTransactions } from "../data/fetchTransactions";
import fetchAavePools from '../data/fetchAavePools'
import fetchAavePositions from '../data/fetchAavePositions'
import fetchCreamPools from '../data/fetchCreamPools'
import fetchCreamPositions from '../data/fetchCreamPositions'
import CoinInfo from './CoinInfo'

const ETH_PRICE_QUERY = gql`
  query bundles {
    bundles(where: { id: "1" }) {
      ethPrice
    }
  }
`
const ChainInfo = () => {
  const connectionInfo = useContext(ConnectionContext);
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [erc20Transations, setERC20Transations] = useState<Transaction[]>([])
  const [allTokenBalances, setAllTokenBalances] = useState<TokenBalance[]>([])
  const [portfolio, setPortfolio] = useState<Portfolio>()
  const [aavePoolsData, setAaavePoolsData] = useState()
  const [creamPoolsData, setCreamPoolsData] = useState()

  const { loading: ethLoading, data: ethPriceData } = useQuery(
    ETH_PRICE_QUERY,
    {
      client: apolloClient,
    })

  const ethPriceInUSD = ethPriceData && ethPriceData.bundles[0].ethPrice

  const updateAllBalances = async () => {
    const fetchedBalances = await fetchAllBalances(
      connectionInfo.account || "", 
      connectionInfo.chainId,
      ethPriceInUSD,
      erc20Transations,
      connectionInfo.library!
    )
    setAllTokenBalances(fetchedBalances)
  }

  const updateERC20Transactions = async () => {
    const fetchedTransactions = await fetchERC20Transactions(connectionInfo.account || "", connectionInfo.chainId)
    setERC20Transations(fetchedTransactions)
  }

  const updateTransactions = async () => {
    const fetchedTransactions = await fetchTransactions(connectionInfo.account || "", connectionInfo.chainId)
    setTransactions(fetchedTransactions)
  }

  const updatePortfolio = async () => {
    let allTransactions = transactions
    allTransactions.push(...erc20Transations)

    const incomingTransactions = filterIncomingTransactions(
      new String(connectionInfo.account),
      allTransactions
    )
    const outgoingTransactions = filterOutgoingTransactions(
      new String(connectionInfo.account),
      allTransactions
    )

    const portfolio = await buildPortfolio(
      new String(connectionInfo.account),
      connectionInfo.chainId,
      allTokenBalances,
      incomingTransactions,
      outgoingTransactions
    )
    setPortfolio(portfolio)
  }

  useEffect(() => {
    updateERC20Transactions()
  }, [ethPriceInUSD])

  useEffect(() => {
    updateTransactions()
  }, [erc20Transations])

  useEffect(() => {
    updateAllBalances()
  }, [transactions])

  useEffect(() => {
    updatePortfolio()
  }, [allTokenBalances])

  useEffect(() => {
    if (connectionInfo.chainId !== undefined) {
      const fetchThePools = async () => {
        const aavePoolData = await fetchAavePools(connectionInfo.chainId)
        const creamPoolData = await fetchCreamPools(connectionInfo.chainId)
        setAaavePoolsData(aavePoolData)
        setCreamPoolsData(creamPoolData)
      }
      fetchThePools()
    }
  }, [connectionInfo.account, connectionInfo.chainId])

  const renderedAavePoolData = (aavePoolsData ?? []).map((pool, i) => {
    return (<div className="text-lg" key={i}> Lend {pool.symbol} yielding {Number(pool.supplyAPY).toFixed(3) * 100}% APY</div>)
  });

  const renderedCreamPoolData = (creamPoolsData ?? []).map((pool, i) => {
    return (<div className="text-lg" key={i}> Lend {pool.tokenSymbol} yielding {Number(pool.apy).toFixed(3) *100}% APY</div>)
  });

  const renderedBalances = allTokenBalances.map((balance, i) => {
    return (<CoinInfo key={i} {...balance}></CoinInfo>)
  })

  const renderPortfolio = () => {
    return (
      <div className="portfolio pb-0 font-actor text-3xl font-semibold space-x-4">
        <div className="currency text-xs">Currency: {portfolio?.currency}</div>
        <div className="flex items-center justify-between pt-6">
          <div className="balance">Current balance: ${portfolio?.balance}</div>
          <div className="gainLoss text-lg">Profit/loss: ${portfolio?.overallGainLoss}</div>
          <div className="gainLossPercentage text-lg">Profit/loss: {portfolio?.overallGainLossPercentage}%</div>
        </div>
        <div className="justify-between space-x-2 p-6 font-dmsans md:flex">
          <div className="ml-2 w-full space-y-2 md:ml-0 md:w-1/3">
            <div className="text-sm font-semibold uppercase">Money doing nothing</div>
            {renderedBalances}
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-sm font-semibold uppercase">Money earning yield</div>
            <div className="rounded-md border p-2">
              <div className="text-sm">Lend on Aave (<a href="https://aave.com/">Read more</a>)</div>
              {renderedAavePoolData}
            </div>
            <div className="rounded-md border p-2">
              <div className="text-sm">Lend on Cream (<a href="https://app.cream.finance/">Read more</a>)</div>
              {renderedCreamPoolData}
            </div>
            <div className="rounded-md border p-2">
              <div className="text-sm">Deposit to Uniswap</div>
              <div className="text-xs">Uniswap is a liquidity pool. <a href="https://uniswap.org/">Read more.</a></div>
              <div className="font-actor font-bold">2.8% APY</div>
            </div>
          </div>
          <div className="w-full space-y-2 md:w-1/3">
            <div className="text-sm font-semibold uppercase">Money earning yield & rewards</div>
            <div className="rounded-md border bg-green-200 p-2 ring-2 ring-green-700 ring-offset-2">
              <div className="font-actor text-sm">Locked: $ 1254</div>
              <div className="font-actor text-lg font-semibold">Earned: $ 12.02030321</div>
              <div className="text-xs">Withdraw money</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-4 text-xs text-right">
      <p className="accountInfo">Portfolio info for {connectionInfo.account}</p>
      {renderPortfolio()}
    </div>
  )
}

export default ChainInfo
