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
	"nft": {
		"name": "Atila Landing Page Banner",
		"description": "The landing page banner image for atila.ca",
		"image": "https://atila.ca/static/media/landing-cover-default.4fd96d95.png"
	},
	"destination_address": "0xd60271b10861145D2b26d27cb1E59Dd6d367959C",
	"chain_id": "4"
}
'
'
```

## Deployment
1. Deploys to AWS Lambda
    - [Staging Lambda Console](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/arthouse-server-staging-saveNFTAPI)
    - Set environment variables: `INFURA_API_KEY` and `CONTRACT_DEPLOYMENT_WALLET_PRIVATE_KEY`


## Appendix


### Sample Response

```json
{
    "nft": {
        "name": "Atila Landing Page Banner",
        "description": "The landing page banner image for atila.ca",
        "image": "https://atila.ca/static/media/landing-cover-default.4fd96d95.png",
        "tokenId": {
            "type": "BigNumber",
            "hex": "0x01"
        },
        "tokenURI": "https://ipfs.infura.io/ipfs/QmeF8r7g529A6JAQUA1quRYHX2HD1W2RULAyV4G8CQQ1kA"
    },
    "blockExplorerUrl": "https://rinkeby.etherscan.io/token/0xadbbc603a5d477e6307c52721cd2b8d7b3b3b16d?a=1",
    "marketplaceUrls": [
        "https://testnets.opensea.io/assets/rinkeby/0xadbbc603a5d477e6307c52721cd2b8d7b3b3b16d/1",
        "https://rinkeby.rarible.com/token/0xadbbc603a5d477e6307c52721cd2b8d7b3b3b16d:1",
        "https://rinkeby.looksrare.org/collections/0xadbbc603a5d477e6307c52721cd2b8d7b3b3b16d/1",
        "https://testnets.nftrade.com/assets/rin/0xadbbc603a5d477e6307c52721cd2b8d7b3b3b16d/1"
    ],
    "transaction": {
        "hash": "0x4ae0d8df8513cb6816bf4ecfd1c7cc3aa9b1f8a9b642b0bdbf63f5990b138c2d",
        "to": "0xADbBc603a5d477e6307c52721cD2B8D7B3B3B16d",
        "from": "0x518CfB8892F895EDCe659D46995ebC10e025c1dE",
        "gasUsed": {
            "type": "BigNumber",
            "hex": "0x02d382"
        },
        "url": "https://rinkeby.etherscan.io/tx/0x4ae0d8df8513cb6816bf4ecfd1c7cc3aa9b1f8a9b642b0bdbf63f5990b138c2d"
    }
}
```
