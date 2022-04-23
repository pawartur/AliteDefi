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

const ChainInfo = () => {
  const connectionInfo = useContext(ConnectionContext);
  const [transations, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState<Number>(0)
  const [portfolio, setPortfolio] = useState<Portfolio>()

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
    </div>
  )
}

export default ChainInfo
