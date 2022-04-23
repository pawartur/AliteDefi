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

  const updatePortfolio = () => {
    const incomingTransactions = filterIncomingTransactions(
      new String(connectionInfo.account),
      erc20Transations
    )
    const outgoingTransactions = filterOutgoingTransactions(
      new String(connectionInfo.account),
      erc20Transations
    )

    const portfolio = buildPortfolio(
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
    return (
      <div className="portfolio flex pb-0 font-actor text-3xl font-semibold space-x-4">
        <div className="currency">Currency: {portfolio?.currency}</div>
        <div className="balance">Balance: {portfolio?.balance}</div>
        <div className="gainLoss">+/-: {portfolio?.overallGainLoss}</div>
        <div className="gainLossPercentage">+/-(%): {portfolio?.overallGainLossPercentage}</div>
      </div>
    )
  }

  return (
    <div>
        <p className="accountInfo">Address {connectionInfo.account}</p>
        {renderPortfolio()}
    </div>
  )
}

export default ChainInfo
