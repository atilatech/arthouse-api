import { ContractReceipt, ethers, Signer } from 'ethers';

import {
    CONFIG_CHAINS
  } from './config';

import NFT from './artifacts/contracts/NFT.sol/NFT.json';
import { Chain } from './models/Chain';
import { getAccount, getProvider } from './utils/network-helpers';
import { getMarketplaceUrls } from './models/Marketplace';
import { NFTMetadata } from './models/NFT';
import { uploadToIPFS } from './utils/file-manager';
const { create } = require("ipfs-http-client");

const ipfsHostUrl = 'https://ipfs.infura.io:5001/api/v0';
const client = (create as any)(ipfsHostUrl);

export interface CreateNFTRequest {
    nft: NFTMetadata,
}

export const createNFT = async (request: CreateNFTRequest) =>{


    const { nft } = request;
    const { name, description, owner, chainId } = nft;
    let { image, address } = nft;

    const activeChain = new Chain({...CONFIG_CHAINS[chainId]});
    address = address || activeChain.NFT_ADDRESS; // if an address isn't specified, use the default address for the chain
    
    // TODO getAccount() is also calling getProvider() is this wasted duplicate effort?
    const signer = getAccount(chainId) as Signer;
    const provider = getProvider(chainId);

    const gasPrice = await provider.getGasPrice();
    if (!image.includes("ipfs.")) {
        image = await uploadToIPFS(image);
    }

    const data = JSON.stringify({
        name, description, image
    });
    let tokenURI = "";

    try {
        const added = await client.add(data)
        tokenURI = `https://ipfs.infura.io/ipfs/${added.path}`
    }
    catch (ipfsError) {
        console.log(ipfsError);
        throw new Error(`IPFSError: ${ipfsError}`);
    }
    // const url = "https://ipfs.moralis.io:2053/ipfs/QmXYfYAHxTwbY5sQJUNB2ftF5aHvxfkBUwgEKM5dSfVVLg";

    let nftContract = new ethers.Contract(address, NFT.abi, signer);
    let mintTransactionPromise = await nftContract.createTokenOnBehalfOf(tokenURI, owner, {gasPrice})
    let mintTransaction: ContractReceipt = await mintTransactionPromise.wait();

    let event = mintTransaction.events![0]
    let tokenId = event.args![2].toNumber();

    const blockExplorerUrl = `${activeChain.BLOCK_EXPLORER_URL}/token/${activeChain.NFT_ADDRESS}?a=${tokenId}`;
    console.log("\x1b[32m%s\x1b[0m", `Succesfully Minted NFT! View in block explorer: ${blockExplorerUrl}`);

    const transactionMetadata = {
        hash: mintTransaction.transactionHash,
        to: mintTransaction.to,
        from: mintTransaction.from,
        gasUsed: mintTransaction.gasUsed,
        url: `${activeChain.BLOCK_EXPLORER_URL}/tx/${mintTransaction.transactionHash}`
    }

    const marketplaceUrls = getMarketplaceUrls(nft);
    
    console.log("\x1b[32m%s\x1b[0m", `View in marketplaces: ${marketplaceUrls}`);
    return { nft, blockExplorerUrl, marketplaceUrls, transaction: transactionMetadata };
}
