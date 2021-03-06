import type { NextPage } from 'next'
import React, { useEffect, useState, useCallback } from "react";
import Head from 'next/head'
import { ethers } from "ethers"
import Web3Modal from "web3modal"
import { providerOptions } from "../utils/providerOptions"
import { toHex } from '../utils/toHex'
import { ADDITIONAL_CHAINS } from '../utils/apiParams'
import ConnectionContext from '../utils/ConnectionContext'
import ChainInfo from '../components/ChainInfo'

const Home: NextPage = () => {
  const [_provider, setProvider] = useState()
  const [library, setLibrary] = useState<ethers.providers.Web3Provider>()
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [account, setAccount] = useState<string>()
  const [_signature, setSignature] = useState("")
  const [_error, setError] = useState("")
  const [chainId, setChainId] = useState<number>()
  const [network, setNetwork] = useState<number>()
  const [_message, setMessage] = useState("")
  const [_verified, setVerified] = useState()

  const connectWallet = useCallback(async () => {
    try {
      if (web3Modal) {
        const provider = await web3Modal.connect()
        const library = new ethers.providers.Web3Provider(provider)
        const accounts = await library.listAccounts()
        const network = await library.getNetwork()
        setProvider(provider)
        setLibrary(library)
        if (accounts) setAccount(accounts[0])
        setChainId(network.chainId)
      }
    } catch (error) {
      setError(error as string)
    }
  }, [web3Modal]);

  const handleNetwork = (e: any) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const switchNetwork = async () => {
    if (!library || !library.provider.request) return
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }]
      });
    } catch (switchError) {
      if ((switchError as any).code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [ADDITIONAL_CHAINS[toHex(network)]]
          });
        } catch (error) {
          setError(error as string);
        }
      }
    }
  };

  const refreshState = () => {
    setAccount(undefined);
    setChainId(undefined);
    setNetwork(undefined);
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = async () => {
    if (web3Modal) {
      await web3Modal.clearCachedProvider();
      refreshState();
    }
  };

  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connectWallet();
    } else {
      const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions // required
      });
      setWeb3Modal(web3Modal)
    }
  }, [connectWallet, web3Modal]);

  return (
    <div className="w-full bg-slate-800">
      <Head>
        <title>Defi Torch</title>
        <meta name="description" content="Alighting the path" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full mx-auto min-h-screen max-w-screen-xl bg-gradient-to-br from-slate-300 to-slate-400 font-dmsans tracking-tight text-slate-600">



        {!account ? (
          <div className="accountManagement">
            <div className="flex items-center justify-between w-full p-6">
              <img className="h-24" src="img/logo.png"></img>
            </div>
            <div className="text-5xl font-bold capitalize leading-tight tracking-tighter text-center">
              Multichain crypto &<br />
              stablecoins portfolio tracking
            </div>
            <div className="mx-auto mt-6 w-full cursor-pointer rounded-full bg-slate-500 p-4 text-center text-sm font-semibold uppercase text-white shadow hover:bg-slate-400 hover:shadow-xl md:w-1/2" onClick={connectWallet}>Connect Wallet</div>
            <div className="w-full bg-gradient-to-br from-slate-100 to-slate-200 mt-10 p-6 font-dmsans tracking-tight text-slate-600">
              <div className="p-6 text-center md:flex">
                <div className="w-full p-2 md:w-1/3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10" fill="#000000" viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <line x1="128" y1="72" x2="128" y2="88" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
                    <line x1="128" y1="168" x2="128" y2="184" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
                    <circle cx="128" cy="128" r="96" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></circle>
                    <path d="M104,168h36a20,20,0,0,0,0-40H116a20,20,0,0,1,0-40h36" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path>
                  </svg>
                  Automatic profitability tracking of any crypto currency
                </div>
                <div className="w-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10" fill="#000000" viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <rect x="32" y="48" width="192" height="136" rx="8" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></rect>
                    <line x1="160" y1="184" x2="192" y2="224" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
                    <line x1="96" y1="184" x2="64" y2="224" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
                    <line x1="96" y1="120" x2="96" y2="144" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
                    <line x1="128" y1="104" x2="128" y2="144" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
                    <line x1="160" y1="88" x2="160" y2="144" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
                    <line x1="128" y1="48" x2="128" y2="24" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
                  </svg>
                  Stablecoin yield tracking &<br />
                  protocol suggestions
                </div>
                <div className="w-full p-2 md:w-1/3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10" fill="#000000" viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <path d="M122.3,71.4l19.8-19.8a44.1,44.1,0,0,1,62.3,62.3l-28.3,28.2a43.9,43.9,0,0,1-62.2,0" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path>
                    <path d="M133.7,184.6l-19.8,19.8a44.1,44.1,0,0,1-62.3-62.3l28.3-28.2a43.9,43.9,0,0,1,62.2,0" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path>
                  </svg>
                  Multichain support. Polygon & Ethereum, more coming soon.
                </div>
              </div>
            </div>
          </div>
        ) : (
            <div>
              <div className="flex items-center justify-between w-full p-6">
                <img className="h-24" src="img/logo.png"></img>
                <div className="networkHandler flex items-center justify-between">
                  <div className="">
                    <select className="p-4 rounded-full" placeholder="Select network" onChange={handleNetwork}>
                      <option value="1" selected={chainId === 1}>Ethereum Mainnet</option>
                      <option value="42" selected={chainId === 42}>Ethereum Kovan</option>
                      <option value="137" selected={chainId === 137}>Polygon</option>
                    </select>
                    <button className="p-2" onClick={switchNetwork}>Switch Network</button>
                  </div>
                  <div className="accountManagement">
                    <button onClick={disconnect}>Disconnect</button>
                  </div>
                </div>
              </div>

              <ConnectionContext.Provider value={{ account: account, chainId: chainId, library: library }}>
                <ChainInfo />
              </ConnectionContext.Provider>
              </div>
          )}
      </main>

      <footer className="p-6 w-full text-center text-slate-200">
        ETHAmsterdam 2022
      </footer>
    </div>
  )
}

export default Home
