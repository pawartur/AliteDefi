import React, { useContext } from "react";

import ConnectionContext from "../utils/ConnectionContext";

const ChainInfo = () => {
  const connectionInfo = useContext(ConnectionContext);

  return (
    <div>
        Address {connectionInfo.account}
    </div>
  )
}

export default ChainInfo
