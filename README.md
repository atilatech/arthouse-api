# Arthouse Server

Programmatically create NFTs.

## Quickstart
`cp shared.env .env`

Set your desired environment variables and private

`yarn install`

`yarn dev`


Note: Comment out `checkAPIKeyCredits` middleware in `handler.ts` if you don't want to make your API require an API Key.

```typescript
body('chain_id').isLength({ min: 1 }),
checkAPIKeyCredits, // <---- comment this line if you don't want your API to require an API key
async (req: Request, res: Response) => {
```

## Demo

```bash
curl --location --request POST 'https://vxherrwkab.execute-api.us-east-1.amazonaws.com/staging/api/v1/nft' \
--header 'X-ATILA-API-CREDITS-KEY: [YOUR_API_KEY_FROM_art.atila.ca/settings]' \
--header 'Content-Type: application/json' \
--data-raw '{
    "nfts": [
        {
            "nft": {
                "name": "Atila Landing Page Banner [Rinkeby]",
                "description": "The landing page banner image for atila.ca",
                "image": "https://atila.ca/static/media/landing-cover-default.4fd96d95.png"
            },
            "destination_address": "0xd60271b10861145D2b26d27cb1E59Dd6d367959C",
            "chain_id": "4"
        },
        {
            "nft": {
                "name": "Atila Landing Page Banner [Polygon]",
                "description": "The landing page banner image for atila.ca",
                "image": "https://atila.ca/static/media/landing-cover-default.4fd96d95.png"
            },
            "destination_address": "0xd60271b10861145D2b26d27cb1E59Dd6d367959C",
            "chain_id": "137"
        }
    ]
}'
```

## Deployment
1. Deploys to AWS Lambda
    - [Staging Lambda Console](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/arthouse-server-staging-saveNFTAPI)
    - Set environment variables: `INFURA_API_KEY` and `CONTRACT_DEPLOYMENT_WALLET_PRIVATE_KEY`


## Appendix


### Sample Response

```json
{
    "nfts": [
        {
            "nft": {
                "name": "Atila Landing Page Banner [Rinkeby]",
                "description": "The landing page banner image for atila.ca",
                "image": "https://ipfs.infura.io/ipfs/QmbMnVTAiX444S5yZS5MHNgiCk1b8Ff7muWmEnLVXRJYY9",
                "tokenId": 9,
                "tokenURI": "https://ipfs.infura.io/ipfs/Qmcx7XTUf1dhdbgtHaPWjvdPkZCNx2XprkPy5HJ7RHX229"
            },
            "blockExplorerUrl": "https://rinkeby.etherscan.io/token/0x5f3cc650c751fa194f0d1537ecfbb55a2c40a995?a=9",
            "marketplaceUrls": [
                "https://testnets.opensea.io/assets/rinkeby/0x5f3cc650c751fa194f0d1537ecfbb55a2c40a995/9",
                "https://rinkeby.rarible.com/token/0x5f3cc650c751fa194f0d1537ecfbb55a2c40a995:9",
                "https://rinkeby.looksrare.org/collections/0x5f3cc650c751fa194f0d1537ecfbb55a2c40a995/9",
                "https://testnets.nftrade.com/assets/rin/0x5f3cc650c751fa194f0d1537ecfbb55a2c40a995/9"
            ],
            "transaction": {
                "hash": "0xcbaf604a43b3c171a320922aa8c129a831db80d0f705636ec09e4223f04d32af",
                "to": "0x5f3cc650c751Fa194F0d1537ECFBb55a2c40a995",
                "from": "0x518CfB8892F895EDCe659D46995ebC10e025c1dE",
                "gasUsed": {
                    "type": "BigNumber",
                    "hex": "0x024dea"
                },
                "url": "https://rinkeby.etherscan.io/tx/0xcbaf604a43b3c171a320922aa8c129a831db80d0f705636ec09e4223f04d32af"
            }
        },
        {
            "nft": {
                "name": "Atila Landing Page Banner [Polygon]",
                "description": "The landing page banner image for atila.ca",
                "image": "https://ipfs.infura.io/ipfs/QmbMnVTAiX444S5yZS5MHNgiCk1b8Ff7muWmEnLVXRJYY9",
                "tokenId": 9,
                "tokenURI": "https://ipfs.infura.io/ipfs/QmWMKJNAZfBW2QVvALK55B681Vo8iCoA1whckPzxic9c4S"
            },
            "blockExplorerUrl": "https://polygonscan.com/token/0x4ad4ab97820137e75ef98fc29ee0e9077130e905?a=9",
            "marketplaceUrls": [
                "https://opensea.io/assets/matic/0x4ad4ab97820137e75ef98fc29ee0e9077130e905/9",
                "https://nftrade.com/assets/polygon/0x4ad4ab97820137e75ef98fc29ee0e9077130e905/9"
            ],
            "transaction": {
                "hash": "0x03994773579fb1798305a884ac76df076e0644502278ab4ad959c854532713b1",
                "to": "0x4ad4ab97820137e75Ef98FC29Ee0e9077130E905",
                "from": "0x518CfB8892F895EDCe659D46995ebC10e025c1dE",
                "gasUsed": {
                    "type": "BigNumber",
                    "hex": "0x024dea"
                },
                "url": "https://polygonscan.com/tx/0x03994773579fb1798305a884ac76df076e0644502278ab4ad959c854532713b1"
            }
        }
    ],
    "search_credits_available": 600
}
```
