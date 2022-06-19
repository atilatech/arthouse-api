import { RequestHandler } from "express"
import axios from 'axios';
import { CREDITS_REQUIRED } from "../config";
import AtilaAPIKeyCreditService from "../services/AtilaAPIKeyCreditService";

export const checkAPIKeyCredits: RequestHandler = async function (req, res, next) {
    
  console.log("checkAPIKeyCredits");
  const apiKey = req.header("X-ATILA-API-CREDITS-KEY");
  const apiKeyDetails = (await AtilaAPIKeyCreditService.getApiKey(apiKey!)).data.results;
  console.log({ apiKey, apiKeyDetails });

  if (apiKeyDetails?.length < 1) {
    return res.status(401).json({error: "Invalid API key Credentials"});
  }

  const apiKeyDetail = apiKeyDetails[0];

  if (CREDITS_REQUIRED > apiKeyDetail.search_credits_available) {
    return res.status(401).json({error: `Insufficient search credits. This request requires at least ${CREDITS_REQUIRED} credits. You have ${apiKeyDetail.search_credits_available}`});
  }

  let search_credits_available = apiKeyDetail.search_credits_available - CREDITS_REQUIRED;

  (req as any).search_credits_available = search_credits_available;

  try {
    const response = (await AtilaAPIKeyCreditService.patch(apiKeyDetail.id, {search_credits_available})).data;
    console.log({response});
    ({ search_credits_available } = response);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status!).json({error: error.response?.data});
    } else {
      return res.status(400).json({error});
    }
  }
    next()
  }