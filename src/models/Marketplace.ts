import { CONFIG_CHAINS } from "../config";
import { Chain } from "./Chain";
import { NFTMetadata } from "./NFT";

export class Marketplace {
    name: string = "";
    supportedChains: string[] = [];
    getListingUrl: (chain: Chain, nft: NFTMetadata) => string = () => "";
}

export const OpenSea: Marketplace = {
    name: "Opensea",
    supportedChains: ["4", "80001", "137"],
    getListingUrl: (chain: Chain, nft: NFTMetadata) =>  {
        const chainIdToSymbol: {[key: string]: string} = {
            "4": "rinkeby",
            "137": "matic",
            "80001": "mumbai",
        }
        return `https://${chain.IS_MAIN_NET? "" : "testnets."}opensea.io/assets/${chainIdToSymbol[chain.CHAIN_ID]}/${chain.NFT_ADDRESS}/${nft.tokenId}`;
    }
}

export const Rarible: Marketplace = {
    name: "Rarible",
    supportedChains: ["4"],
    getListingUrl: (chain: Chain, nft: NFTMetadata) =>  {
        return `https://${chain.IS_MAIN_NET? "" : "rinkeby."}rarible.com/token/${chain.NFT_ADDRESS.toLowerCase()}:${nft.tokenId}`;
    }
}

export const LooksRare: Marketplace = {
    name: "LooksRare",
    supportedChains: ["4"],
    getListingUrl: (chain: Chain, nft: NFTMetadata) =>  {
        return `https://${chain.IS_MAIN_NET? "" : "rinkeby."}looksrare.org/collections/${chain.NFT_ADDRESS.toLowerCase()}/${nft.tokenId}`
    }
}

export const NFTrade: Marketplace = {
    name: "NFTrade",
    supportedChains: ["4", "56", "137"],
    getListingUrl: (chain: Chain, nft: NFTMetadata) =>  {
        const chainIdToSymbol: {[key: string]: string} = {
            "4": "rin",
            "56": "bsc",
            "137": "polygon",
        }
        return `https://${chain.IS_MAIN_NET? "" : "testnets."}nftrade.com/assets/${chainIdToSymbol[chain.CHAIN_ID]}/${chain.NFT_ADDRESS}/${nft.tokenId}`;
    }
}

export const Marketplaces = [OpenSea, Rarible, LooksRare, NFTrade];

export const getMarketplaceUrls = (nft: NFTMetadata) => {
    const activeChain = CONFIG_CHAINS[nft.chainId];
    return Marketplaces.filter(marketplace => marketplace.supportedChains.includes(activeChain.CHAIN_ID)).map(marketplace => {
       return marketplace.getListingUrl(activeChain, nft)
    })
}