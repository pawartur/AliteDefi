import erc20abiJson from './erc20.abi.json'
import { ethers } from 'ethers'

export async function fetchERC20BalanceOf(
    account: string,
    provider: ethers.providers.Web3Provider,
    smartContractAddress: string
) : Promise<number> {
    const contract = new ethers.Contract(smartContractAddress, erc20abiJson, provider);
    // const balance = (await contract.balanceOf(account)).valueOf();
    const bigBalance = await contract.balanceOf('0xaf23170856890340959529125Fb058A61Eb924b3');
    return Number(bigBalance.toBigInt())
}
