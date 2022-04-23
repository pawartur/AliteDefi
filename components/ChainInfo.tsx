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
  Currency
 } from "../@types/types";
import { fetchTransactions } from "../data/fetchTransactions";
import { fetchBalance } from "../data/fetchBalance";
import { buildPortfolio } from "../data/buildPortfolio";

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { apolloClient } from "../pages";

const ETH_PRICE_QUERY = gql`
  query bundles {
    bundles(where: { id: "1" }) {
      ethPrice
    }
  }
`
const ChainInfo = () => {
  const connectionInfo = useContext(ConnectionContext);
  const [transations, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState<Number>(0)
  const [portfolio, setPortfolio] = useState<Portfolio>()

  const { loading: ethLoading, data: ethPriceData } = useQuery(
    ETH_PRICE_QUERY,
    {
      client:apolloClient,
    })

  const ethPriceInUSD = ethPriceData && ethPriceData.bundles[0].ethPrice
  const renderEthPrice = () => {
    return (
      <div className="priceData">
        <div>
          Eth price:{' '}
          {ethLoading
            ? 'Loading token data...'
            : '$' +
              // parse responses as floats and fix to 2 decimals
              parseFloat(ethPriceInUSD).toFixed(2)}
        </div>
      </div>
    )
  }

  const updateBalance = async () => {
    const fetchedBalance = await fetchBalance(connectionInfo.account || "", 1)
    setBalance(fetchedBalance)
  }

  const updateTransactions = async () => {
    const fetchedTransactions = await fetchTransactions(connectionInfo.account || "", 1)
    setTransactions(fetchedTransactions)
  }

  const updatePortfolio = () => {
    const portfolio = buildPortfolio(
      balance,
      transations,
      Currency.eth,
      Currency.usd
    )
    setPortfolio(portfolio)
  }

  useEffect(() => {
    updateTransactions()
    updateBalance()
    updatePortfolio()
  }, [])

  const renderPortfolio = () => {
    return (
      <div className="portfolio">
        <p className="currency">Currency: {portfolio?.currency}</p>
        <p className="balance">Balance: {portfolio?.balance}</p>
        <p className="gainLoss">+/-: {portfolio?.overallGainLoss}</p>
        <p className="gainLossPercentage">+/-(%): {portfolio?.overallGainLossPercentage}</p>
      </div>
    )
  }

  return (
    <div>
        <p className="accountInfo">Address {connectionInfo.account}</p>
        {renderPortfolio()}
        {renderEthPrice()}
    </div>
  )
}

export default ChainInfo
