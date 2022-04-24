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

  const { loading: ethLoading, data: ethPriceData } = useQuery(
    ETH_PRICE_QUERY,
    {
      client: apolloClient,
    })

  const ethPriceInUSD = ethPriceData && ethPriceData.bundles[0].ethPrice
  //parseFloat(ethPriceInUSD.toString()).toFixed(2)}  

  const updateAllBalances = async () => {
    const fetchedBalances = await fetchAllBalances(
      connectionInfo.account || "",
      1,
      ethPriceInUSD,
      erc20Transations,
      connectionInfo.library!
    )
    setAllTokenBalances(fetchedBalances)
  }

  const updateERC20Transactions = async () => {
    const fetchedTransactions = await fetchERC20Transactions(connectionInfo.account || "", 1)
    setERC20Transations(fetchedTransactions)
  }

  const updateTransactions = async () => {
    const fetchedTransactions = await fetchTransactions(connectionInfo.account || "", 1)
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
        setAaavePoolsData(aavePoolData)
      }
      fetchThePools()
    }
  }, [connectionInfo.account, connectionInfo.chainId])

  const renderedPoolData = (aavePoolsData ?? []).map((pool, i) => {
    return (<div key={i}> APY: {pool.supplyAPY} </div>)
  });

  const renderPortfolio = () => {
    return (
      <div className="portfolio pb-0 font-actor text-3xl font-semibold space-x-4">
        <div className="currency text-xs">Currency: {portfolio?.currency}</div>
        <div className="flex items-center justify-between pt-6">
          <div className="balance">Current balance: ${portfolio?.balance}</div>
          <div className="gainLoss text-lg">Profit/loss: ${portfolio?.overallGainLoss}</div>
          <div className="gainLossPercentage text-lg">Profit/loss: {portfolio?.overallGainLossPercentage}%</div>
        </div>
        <div className="flex items-center justify-between mt-10 p-2">
          <div>
            <div className="pl-6 font-dmsans text-xl font-semibold">Cryptocurrency</div>
            <div className="pl-6 font-dmsans text-sm text-white">How much money do you waste?</div>
          </div>
          <div>
            <div className="pb-0 font-actor text-xl font-semibold">$ 2,234.0123</div>
            <div className="pl-2 text-sm text-slate-100">Cryptocurrency</div>
          </div>
        </div>
        <div className="justify-between space-x-2 p-6 font-dmsans md:flex">
          <div className="ml-2 w-full space-y-2 md:ml-0 md:w-1/3">
            <div className="text-sm font-semibold uppercase">Money doing nothing</div>
            <div className="rounded-md border bg-red-600 p-2 text-white ring-2 ring-red-600 ring-offset-2">
              <div className="text-sm">ETH</div>
              <div className="font-actor font-bold">$ 3063</div>
              <div className="font-actor text-xs">Medium purchase price: $ 3456</div>
              <div className="text-xs">Wallet 0x213[..]</div>
            </div>
            <div className="rounded-md border p-2">
              <div className="text-sm">Matic</div>
              <div className="font-actor font-bold">$ 2608</div>
              <div className="text-xs">Wallet 0x213[..]</div>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-sm font-semibold uppercase">Money earning yield</div>
            <div className="rounded-md border p-2">
              {renderedPoolData}
              <div className="text-sm">Deposit to Sushiswap</div>
              <div className="font-actor font-bold">3.4% APY</div>
              <div className="text-xs">Sushiswap is a liquidity pool. Read more.</div>
            </div>
            <div className="rounded-md border p-2">
              <div className="text-sm">Deposit to Uniswap</div>
              <div className="font-actor font-bold">2.8% APY</div>
              <div className="text-xs">Uniswap is a liquidity pool. Read more.</div>
            </div>
          </div>
          <div className="w-full space-y-2 md:w-1/3">
            <div className="text-sm font-semibold uppercase">Money earning yield & rewards</div>
            <div className="rounded-md border bg-green-200 p-2 ring-2 ring-green-700 ring-offset-2">
              <div className="font-actor text-sm">Locked: $ 1254</div>
              <div className="font-actor font-semibold">Earned: $ 12.02030321</div>
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
