import request from "axios";
import { ATILA_API_URL, ATILA_USER_PROFILE_API_KEY } from "../config";

class AtilaAPIKeyCreditService {

    static apiKeyCreditURL = `${ATILA_API_URL}/api/payment/api-key-credits`;

    static getApiKey = (apiKey: string) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${AtilaAPIKeyCreditService.apiKeyCreditURL}/public-key/?public_key=${apiKey}/`,
        });

        return apiCompletionPromise;
    };

    static patch = (id: string, data: any) => {
        console.log({ATILA_USER_PROFILE_API_KEY});
        const apiCompletionPromise = request({
            method: 'patch',
            url: `${AtilaAPIKeyCreditService.apiKeyCreditURL}/${id}/`,
            headers: {
                'Authorization': `Token ${ATILA_USER_PROFILE_API_KEY}`
            },
            data
        });

        return apiCompletionPromise;
    };
}

export default AtilaAPIKeyCreditService;