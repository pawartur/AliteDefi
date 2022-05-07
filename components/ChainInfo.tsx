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
import { buildPortfolio } from "../data/buildPortfolio";
import { filterIncomingTransactions } from "../data/filterIncomingTransactions";
import { fetchAllBalances } from "../data/fetchAllBalances";
import { filterOutgoingTransactions } from "../data/filterOutgoingTransactions";
import { fetchTransactions } from "../data/fetchTransactions";
import fetchAavePools from '../data/fetchAavePools'
import fetchAavePositions from '../data/fetchAavePositions'
import fetchCreamPools from '../data/fetchCreamPools'
import fetchCreamPositions from '../data/fetchCreamPositions'
import CoinInfo from './CoinInfo'

const ChainInfo = () => {
  const connectionInfo = useContext(ConnectionContext);
  const [portfolio, setPortfolio] = useState<Portfolio>()
  const [aavePoolsData, setAaavePoolsData] = useState()
  const [creamPoolsData, setCreamPoolsData] = useState()

  const updateInfo = async () => {
    const [
      transactions,
      erc20Transations,
      aavePoolData,
      creamPoolData
    ] = await Promise.all([
      fetchTransactions(connectionInfo.account || "", connectionInfo.chainId || 1),
      fetchERC20Transactions(connectionInfo.account || "", connectionInfo.chainId || 1),
      fetchAavePools(connectionInfo.chainId),
      fetchCreamPools(connectionInfo.chainId)
    ])

    let allTransactions = transactions
    allTransactions.push(...erc20Transations)

    const allTokenBalances = await fetchAllBalances(
      connectionInfo.account || "", 
      connectionInfo.chainId || 1,
      erc20Transations,
      connectionInfo.library!
    )

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
      connectionInfo.chainId || 1,
      allTokenBalances,
      incomingTransactions,
      outgoingTransactions
    )
    setPortfolio(portfolio)
    setAaavePoolsData(aavePoolData)
    setCreamPoolsData(creamPoolData)
  }

  useEffect(() => {
    updateInfo()
  }, [
    connectionInfo.account, 
    connectionInfo.chainId
  ])

  const renderedAavePoolData = (aavePoolsData ?? []).map((pool, i) => {
    return (<div className="text-lg" key={i}> Lend {pool.symbol} yielding {Number(pool.supplyAPY).toFixed(3) * 100}% APY</div>)
  });

  const renderedCreamPoolData = (creamPoolsData ?? []).map((pool, i) => {
    return (<div className="text-lg" key={i}> Lend {pool.tokenSymbol} yielding {Number(pool.apy).toFixed(3) *100}% APY</div>)
  });

  const renderedBalances = portfolio?.allTokenBalances.map((balance, i) => {
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
