import { RequestHandler } from "express"
import axios from 'axios';
import { MINT_NFT_PRICE_IN_CREDITS } from "../config";
import AtilaAPIKeyCreditService from "../services/AtilaAPIKeyCreditService";

export const checkAPIKeyCredits: RequestHandler = async function (req, res, next) {

  const apiKey = req.header("X-ATILA-API-CREDITS-KEY");
  const apiKeyDetails = (await AtilaAPIKeyCreditService.getApiKey(apiKey!)).data.results;

  if (apiKeyDetails?.length < 1) {
    return res.status(401).json({error: "Invalid API key Credentials"});
  }

  const apiKeyDetail = apiKeyDetails[0];

  if (MINT_NFT_PRICE_IN_CREDITS > apiKeyDetail.search_credits_available) {
    return res.status(401).json({error: `Insufficient search credits. This request requires at least ${MINT_NFT_PRICE_IN_CREDITS} credits. You have ${apiKeyDetail.search_credits_available}`});
  }

  let search_credits_available = apiKeyDetail.search_credits_available - MINT_NFT_PRICE_IN_CREDITS;

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