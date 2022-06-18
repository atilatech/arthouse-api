import { ethers, Signer } from 'ethers';

import {
    CONFIG_CHAINS
  } from './config';

import NFT from './artifacts/contracts/NFT.sol/NFT.json';
import { Chain } from './models/Chain';
import { getAccount, getProvider } from './utils/network-helpers';
import { getMarketplaceUrls } from './models/Marketplace';
import { NFTMetadata } from './models/NFT';

export const createNFT = async () =>{
    const chainId = "137";
    const activeChain = new Chain({...CONFIG_CHAINS[chainId]});
    const NFT_ADDRESS = activeChain.NFT_ADDRESS;
    
    // TODO getAccount() is also calling getProvider() is this wasted duplicate effort?
    const signer = getAccount(chainId) as Signer;
    const provider = getProvider(chainId);

    const gasPrice = await provider.getGasPrice();
    const url = "https://ipfs.moralis.io:2053/ipfs/QmXYfYAHxTwbY5sQJUNB2ftF5aHvxfkBUwgEKM5dSfVVLg";

    console.log({gasPrice});
    let nftContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, signer);
    let mintTransactionPromise = await nftContract.createToken(url, {gasPrice})
    let mintTransaction = await mintTransactionPromise.wait()
    let event = mintTransaction.events[0]
    let tokenId = event.args[2]

    const blockExplorerUrl = `${activeChain.BLOCK_EXPLORER_URL}/token/${activeChain.NFT_ADDRESS}?a=${tokenId}`;

    const nft: NFTMetadata = {
        name: "",
        description: "",
        image: url,
        tokenId,
        chainId,
    }

    const marketplaceUrls = getMarketplaceUrls(chainId, nft);
    
    console.log("\x1b[32m%s\x1b[0m", `View in block explorer: ${blockExplorerUrl}`);
    console.log("\x1b[32m%s\x1b[0m", `View in marketplaces: ${marketplaceUrls}`);
    return { nft, blockExplorerUrl, marketplaceUrls };
}
