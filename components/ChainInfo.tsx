import 
  React, 
  { 
    useContext, 
    useEffect, 
    useState
  } from "react";

import ConnectionContext from "../utils/ConnectionContext";
import { Transaction } from "../@types/types";
import { fetchTransactions } from "../data/fetchTransactions";

const ChainInfo = () => {
  const connectionInfo = useContext(ConnectionContext);
  const [transations, setTransactions] = useState<Transaction[]>([])

  const updateTransactions = async () => {
    const fetchedTransactions = await fetchTransactions(connectionInfo.account || "", 1)
    setTransactions(fetchedTransactions)
  }

  useEffect(() => {
    updateTransactions()
  }, [])

  const renderTransaction = (transaction: Transaction) => {
    return (
      <p className="transaction">from {transaction.from} to {transaction.to}</p>
    )
  }

  const renderTransactions = () => {
    return (
      <div className="transactions">
        {transations.map((transaction: Transaction) => {
          return renderTransaction(transaction)
        })}
      </div>
    )
  }

  return (
    <div>
        <p className="accountInfo">Address {connectionInfo.account}</p>
        {renderTransactions()}
    </div>
  )
}

export default ChainInfo
