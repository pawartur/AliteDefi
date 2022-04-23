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

const ETH_PRICE_QUERY = gql`
  query bundles {
    bundles(where: { id: "1" }) {
      ethPrice
    }
  }
`
const ChainInfo = () => {
  const connectionInfo = useContext(ConnectionContext);
  const [erc20Transations, setERC20Transations] = useState<Transaction[]>([])
  const [allTokenBalances, setAllTokenBalances] = useState<TokenBalance[]>([])
  const [portfolio, setPortfolio] = useState<Portfolio>()

  const { loading: ethLoading, data: ethPriceData } = useQuery(
    ETH_PRICE_QUERY,
    {
      client:apolloClient,
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

  const updateTransactions = async () => {
    const fetchedTransactions = await fetchERC20Transactions(connectionInfo.account || "", 1)
    setERC20Transations(fetchedTransactions)
  }

  const updatePortfolio = async () => {
    const incomingTransactions = filterIncomingTransactions(
      new String(connectionInfo.account),
      erc20Transations
    )
    const outgoingTransactions = filterOutgoingTransactions(
      new String(connectionInfo.account),
      erc20Transations
    )

    const portfolio = await buildPortfolio(
      new String(connectionInfo.account),
      allTokenBalances,
      incomingTransactions,
      outgoingTransactions
    )
    setPortfolio(portfolio)
  }

  useEffect(() => {
    updateTransactions()
  }, [ethPriceInUSD])

  useEffect(() => {
    updateAllBalances()
  }, [erc20Transations])

  useEffect(() => {
    updatePortfolio()
  }, [allTokenBalances])

  const renderPortfolio = () => {
    console.log('that portfolio', portfolio)
    return (
      <div className="portfolio pb-0 font-actor text-3xl font-semibold space-x-4">
        <div className="currency text-xs">Currency: {portfolio?.currency}</div>
        <div className="flex items-center justify-between pt-6">
        <div className="balance">Current balance: ${portfolio?.balance}</div>
        <div className="gainLoss text-lg">Profit/loss: ${portfolio?.overallGainLoss}</div>
        <div className="gainLossPercentage text-lg">Profit/loss: {portfolio?.overallGainLossPercentage}%</div>
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
