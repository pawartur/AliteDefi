import React, { useContext } from "react";

import ConnectionContext from "../utils/ConnectionContext";

const ChainInfo = () => {
  const connectionInfo = useContext(ConnectionContext);

  return (
    <section>
      <div>
        Address {connectionInfo.account}
      </div>
      <div>
        ChainId {connectionInfo.chainId}
      </div>
    </section>
  )
}

export default ChainInfo
