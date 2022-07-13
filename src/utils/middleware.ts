import { RequestHandler } from "express"
import axios from 'axios';
import { CONFIG_CHAINS, MAX_NFTS_PER_REQUEST, MINT_NFT_PRICE_IN_CREDITS } from "../config";
import AtilaAPIKeyCreditService from "../services/AtilaAPIKeyCreditService";
import { CreateNFTRequest } from "../create-nft";
import validator from 'validator';
import { Chain } from "../models/Chain";

export const checkNFTRequestBody: RequestHandler = async function (req, res, next) {

    const { nfts }: {nfts: CreateNFTRequest[]} = req.body;

    if (!Array.isArray(nfts) || nfts.length < 1) {
        return res.status(400).json({error: `Please pass an array of 1 or more NFT requests`});
    }

    if (nfts.length > MAX_NFTS_PER_REQUEST) {
        return res.status(400).json({error: `There is a temporarly limit of ${MAX_NFTS_PER_REQUEST} NFTs per request.`});
    }

    nfts.forEach(createNFTRequest => {
      const { nft } = createNFTRequest;

      const validChainIDs = Object.keys(CONFIG_CHAINS);

        if (!validChainIDs.includes(nft.chainId)) {
            return res.status(400).json({error: `Invalid chainId, please select one of ${validChainIDs}`});
        }
        
        const activeChain = new Chain({...CONFIG_CHAINS[nft.chainId]});
        nft.address = nft.address || activeChain.NFT_ADDRESS; // if an address isn't specified, use the default address for the chain

        if (!validator.isEthereumAddress(nft.address)) {
            return res.status(400).json({error: "Invalid smart contract address"});
        }
        if (!validator.isEthereumAddress(nft.owner)) {
            return res.status(400).json({error: "Invalid owner address"});
        }

    });

    req.body.nfts = nfts; // update the request body with changes

    next()

}

export const checkAPIKeyCredits: RequestHandler = async function (req, res, next) {

  const apiKey = req.header("X-ATILA-API-CREDITS-KEY");
  const apiKeyDetails = (await AtilaAPIKeyCreditService.getApiKey(apiKey!)).data.results;
  console.log({apiKey, apiKeyDetails});
  if (apiKeyDetails?.length < 1) {
    return res.status(401).json({error: "Invalid API key Credentials"});
  }

  const apiKeyDetail = apiKeyDetails[0];

  const { nfts }: {nfts: CreateNFTRequest[]} = req.body;

  const CREDITS_REQUIRED = MINT_NFT_PRICE_IN_CREDITS * nfts.length;

  if (CREDITS_REQUIRED > apiKeyDetail.search_credits_available) {
    return res.status(401).json({error: `Insufficient search credits. This request requires at least ${CREDITS_REQUIRED} credits. You have ${apiKeyDetail.search_credits_available}`});
  }

  let search_credits_available = apiKeyDetail.search_credits_available - CREDITS_REQUIRED;

  try {
    const response: any = (await AtilaAPIKeyCreditService.patch(apiKeyDetail.id, {search_credits_available})).data;
    console.log({response});
    (req as any).search_credits_available = response.search_credits_available;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status!).json({error: error.response?.data});
    } else {
      return res.status(400).json({error});
    }
  }
    next()
}