import type { NextPage } from 'next'
import React, { useEffect, useState, useContext } from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ethers } from "ethers"
import Web3Modal from "web3modal"
import { providerOptions } from "../utils/providerOptions"
import { toHex } from '../utils/toHex'
import { networkParams } from '../utils/networkParams'
import { truncateAddress } from '../utils/truncateAddress'
import { Web3Provider } from 'walletlink/dist/provider/Web3Provider'
import ConnectionContext from '../utils/ConnectionContext'
import ChainInfo from './ChainInfo'

const Home: NextPage = () => {
  const [provider, setProvider] = useState()
  const [library, setLibrary] = useState<ethers.providers.Web3Provider>()
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [account, setAccount] = useState<string>()
  const [signature, setSignature] = useState("")
  const [error, setError] = useState("")
  const [chainId, setChainId] = useState<number>()
  const [network, setNetwork] = useState<Number>()
  const [message, setMessage] = useState("")
  const [signedMessage, setSignedMessage] = useState("")
  const [verified, setVerified] = useState()

  const connectWallet = async () => {
    console.log("connectWallet")
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
  };

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
            params: [networkParams[toHex(network)]]
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
    <div className={styles.container}>
      <Head>
        <title>Defi Torch</title>
        <meta name="description" content="Alighting the path" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Defi Torch
        </h1>
          <p>{`Network ID: ${chainId ? chainId : "No Network"}`}</p>
          {!account ? (
            <div className="accountManagement">
              <button onClick={connectWallet}>Connect Wallet</button>
            </div>
          ) : (
            <div>
              <div className="networkHandler">
              <select placeholder="Select network" onChange={handleNetwork}>
                <option value="3">Ropsten</option>
                <option value="4">Rinkeby</option>
                <option value="42">Kovan</option>
                <option value="1666600000">Harmony</option>
                <option value="137">Polygon</option>
              </select>
              <button onClick={switchNetwork}>Switch Network</button>
              </div>
              <div className="accountManagement">
                <button onClick={disconnect}>Disconnect</button>
              </div>
              <ConnectionContext.Provider value={{account: account}}>
                <ChainInfo />
              </ConnectionContext.Provider>
            </div>
          )}
      </main>

      <footer className={styles.footer}>
        ETHAmsterdam 2022
      </footer>
    </div>
  )
}

export default Home
