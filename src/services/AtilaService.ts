import request from "axios";
import { ATILA_API_URL } from "../config";

class AtilaService {

    static getApiKeyUrl = `${ATILA_API_URL}/api/payment/api-key-credits/public-key`;

    static getApiKey = (apiKey: string) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${AtilaService.getApiKeyUrl}/?public_key=${apiKey}`,
        });

        return apiCompletionPromise;
    };
}

export default AtilaService;