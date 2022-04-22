import React from "react"

interface IConnectionContext {
    account: string | undefined;
    chainId: Number | undefined;
}

const ConnectionContext = React.createContext<IConnectionContext>({account: undefined, chainId: undefined})

export default ConnectionContext
