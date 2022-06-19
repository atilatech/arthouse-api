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

export interface CreateNFTArgs {
    nft: NFTMetadata,
    destination_address: string,
    chain_id: string,
}
export const createNFT = async ({ nft, destination_address, chain_id}: CreateNFTArgs) =>{
    const activeChain = new Chain({...CONFIG_CHAINS[chain_id]});
    const NFT_ADDRESS = activeChain.NFT_ADDRESS;
    
    // TODO getAccount() is also calling getProvider() is this wasted duplicate effort?
    const signer = getAccount(chain_id) as Signer;
    const provider = getProvider(chain_id);

    const gasPrice = await provider.getGasPrice();
    if (!nft.image.includes("ipfs.")) {
        nft.image = await uploadToIPFS(nft.image);
    }
    const { name, description, image } = nft;
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

    let nftContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, signer);
    let mintTransactionPromise = await nftContract.createTokenOnBehalfOf(tokenURI, destination_address, {gasPrice})
    let mintTransaction: ContractReceipt = await mintTransactionPromise.wait();

    let event = mintTransaction.events![0]
    let tokenId = event.args![2].toNumber();
    nft.tokenId = tokenId;
    nft.tokenURI = tokenURI;

    const blockExplorerUrl = `${activeChain.BLOCK_EXPLORER_URL}/token/${activeChain.NFT_ADDRESS}?a=${nft.tokenId}`;

    const transactionMetadata = {
        hash: mintTransaction.transactionHash,
        to: mintTransaction.to,
        from: mintTransaction.from,
        gasUsed: mintTransaction.gasUsed,
        url: `${activeChain.BLOCK_EXPLORER_URL}/tx/${mintTransaction.transactionHash}`
    }

    const marketplaceUrls = getMarketplaceUrls(chain_id, nft);
    
    console.log("\x1b[32m%s\x1b[0m", `View in block explorer: ${blockExplorerUrl}`);
    console.log("\x1b[32m%s\x1b[0m", `View in marketplaces: ${marketplaceUrls}`);
    return { nft, blockExplorerUrl, marketplaceUrls, transaction: transactionMetadata };
}
