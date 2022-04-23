import React from "react"
import { ethers } from "ethers"

interface IConnectionContext {
    account: string | undefined;
    chainId: Number | undefined;
    library: ethers.providers.Web3Provider | undefined;
}

const ConnectionContext = React.createContext<IConnectionContext>({account: undefined, chainId: undefined, library: undefined})

export default ConnectionContext
