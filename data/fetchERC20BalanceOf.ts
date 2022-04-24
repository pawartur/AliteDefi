import erc20abiJson from './erc20.abi.json'
import { ethers } from 'ethers'

export async function fetchERC20BalanceOf(
    account: string,
    provider: ethers.providers.Web3Provider,
    smartContractAddress: string
) : Promise<number> {
    console.log('smartContractAddress', smartContractAddress)
    const contract = new ethers.Contract(smartContractAddress, erc20abiJson, provider);
    const bigBalance = await contract.balanceOf(account);
    return Number(bigBalance.toBigInt())
}
