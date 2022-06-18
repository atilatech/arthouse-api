import { ethers, Signer } from 'ethers';

import {
    CONFIG_CHAINS
  } from './config';

import NFT from './artifacts/contracts/NFT.sol/NFT.json';
import { Chain } from './models/Chain';
import { getAccount } from './utils/network-helpers';

const activeChainId = "97";
const activeChain = new Chain({...CONFIG_CHAINS[activeChainId]});
const NFT_ADDRESS = activeChain.NFT_ADDRESS;


export const createNFT = async () =>{


    const signer = getAccount(activeChainId) as Signer;
    const url = "https://ipfs.moralis.io:2053/ipfs/QmXYfYAHxTwbY5sQJUNB2ftF5aHvxfkBUwgEKM5dSfVVLg";

    let nftContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, signer)
    let mintTransactionPromise = await nftContract.createToken(url)
    let mintTransaction = await mintTransactionPromise.wait()
    let event = mintTransaction.events[0]
    let tokenId = event.args[2]

    const nftExplorerUrl = `${activeChain.BLOCK_EXPLORER_URL}/token/${activeChain.NFT_ADDRESS}?a=${tokenId}`;
    
    console.log("\x1b[32m%s\x1b[0m", `View in block explorer: ${nftExplorerUrl}`);

    return { tokenId, nftExplorerUrl}
}
