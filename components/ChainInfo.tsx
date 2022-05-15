import
React,
{
  useContext,
  useEffect,
  useState
} from "react";

import ConnectionContext from "../utils/ConnectionContext";
import {
  ChainInfoModel,
  LiquidityProtocol,
} from "../@types/types";
import { fetchERC20Transactions } from "../data/fetchERC20Transactions";
import { buildPortfolio } from "../data/buildPortfolio";
import { fetchAllBalances } from "../data/fetchAllBalances";
import { fetchTransactions } from "../data/fetchTransactions";
import fetchAavePools from '../data/fetchAavePools'
import fetchCreamPools from '../data/fetchCreamPools'
import CoinInfo from './CoinInfo'
import { buildLiquidityPoolsFromAaveData, buildLiquidityPoolsFromCreamData } from "../data/buildLiquidityPools";
import { fetchERC20TransactionValuesInUSD } from "../data/fetchERC20TransactionValuesInUSD";
import { fetchNativeTransactionValuesInUSD } from "../data/fetchNativeTransactionValuesInUSD";
import { filterIncomingTransactionValuesInUSD } from "../data/filterIncomingTransactionValuesInUSD";
import { filterOutgoingTransactionValuesInUSD } from "../data/filterOutgoingTransactionValuesInUSD";

const ChainInfo = () => {
  const connectionInfo = useContext(ConnectionContext);
  const [model, setModel] = useState<ChainInfoModel>()

  const updateModel = async () => {
    const [
      transactions,
      erc20Transations,
      aavePoolData,
      creamPoolData
    ] = await Promise.all([
      fetchTransactions(connectionInfo.account, connectionInfo.chainId),
      fetchERC20Transactions(connectionInfo.account, connectionInfo.chainId),
      fetchAavePools(connectionInfo.chainId),
      fetchCreamPools(connectionInfo.chainId)
    ])

    const [
      balances,
      transactionValuesInUSD,
      erc20TransactionValuesinUSD
    ] = await Promise.all([
      fetchAllBalances(
        connectionInfo.account, 
        connectionInfo.chainId, 
        erc20Transations, 
        connectionInfo.library
      ),
      fetchNativeTransactionValuesInUSD(
        connectionInfo.chainId,
        transactions
      ),
      fetchERC20TransactionValuesInUSD(
        connectionInfo.chainId, 
        erc20Transations
      ),
    ])

    let mergedTransactions = transactions
    mergedTransactions = mergedTransactions.concat(erc20Transations)
    const mergedTransactionValues = {...transactionValuesInUSD, ...erc20TransactionValuesinUSD}

    const incomingTransactionValuesInUSD = filterIncomingTransactionValuesInUSD(
      connectionInfo.account,
      mergedTransactions,
      mergedTransactionValues
    )

    const outgoingTransactionValuesInUSD = filterOutgoingTransactionValuesInUSD(
      connectionInfo.account,
      mergedTransactions,
      mergedTransactionValues
    )

    setModel({
      portfolio: buildPortfolio(
        connectionInfo.chainId,
        balances,
        incomingTransactionValuesInUSD,
        outgoingTransactionValuesInUSD
      ),
      liquidityPools: {
        [LiquidityProtocol.Aave]: buildLiquidityPoolsFromAaveData(aavePoolData),
        [LiquidityProtocol.Cream]: buildLiquidityPoolsFromCreamData(creamPoolData)
      }
    })
  }

  useEffect(() => {
    updateModel()
  }, [
    connectionInfo.account, 
    connectionInfo.chainId
  ])

  const renderedAavePoolData = (model?.liquidityPools[LiquidityProtocol.Aave] ?? []).map((pool, i) => {
    return (<div className="text-lg" key={i}> Lend {pool.tokenSymbol} yielding {Number(pool.supplyAPY * 100).toFixed(3)}% APY</div>)
  });

  const renderedCreamPoolData = (model?.liquidityPools[LiquidityProtocol.Cream] ?? []).map((pool, i) => {
    return (<div className="text-lg" key={i}> Lend {pool.tokenSymbol} yielding {Number(pool.supplyAPY * 100).toFixed(3)}% APY</div>)
  });

  const renderedBalances = model?.portfolio?.allTokenBalances.map((balance, i) => {
    return (<CoinInfo key={i} {...balance}></CoinInfo>)
  })

  const renderPortfolio = () => {
    return (
      <div className="portfolio pb-0 font-actor text-3xl font-semibold space-x-4">
        <div className="currency text-xs">Currency: {model?.portfolio?.currency}</div>
        <div className="flex items-center justify-between pt-6">
          <div className="balance">Current balance: ${model?.portfolio?.balance}</div>
          <div className="gainLoss text-lg">Profit/loss: ${model?.portfolio?.overallGainLoss}</div>
          <div className="gainLossPercentage text-lg">Profit/loss: {model?.portfolio?.overallGainLossPercentage}%</div>
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
