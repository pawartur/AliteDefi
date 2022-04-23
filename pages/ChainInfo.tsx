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

  return (
    <div>
        Address {connectionInfo.account}
        {transations.map((transaction: Transaction) => {
          <div>
            <p>{transaction.from}</p>
            <p>{transaction.to}</p>
          </div>
        })}
    </div>
  )
}

export default ChainInfo
