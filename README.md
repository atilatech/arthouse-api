# Arthouse API

Create NFTs using an API. The same API used to power [Arthouse](https://art.atila.ca/) ([source code](https://github.com/atilatech/arthouse)).

## Quickstart
`cp shared.env .env`

Set your desired environment variables and private

`yarn install`

`yarn dev`


Note: Comment out `checkAPIKeyCredits` middleware in `handler.ts` if you don't want to make your API require an API Key.

```typescript
body('chainId').isLength({ min: 1 }),
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
                "image": "https://atila.ca/static/media/landing-cover-default.4fd96d95.png",
                "chainId": "4",
                "owner": "0x27F7e8d7C63C414Eae2BB07E1a9B9057a1D382cf"
            }
        },
        {
            "nft": {
                "name": "Atila Landing Page Banner [Polygon]",
                "description": "The landing page banner image for atila.ca",
                "image": "https://atila.ca/static/media/landing-cover-default.4fd96d95.png",
                "chainId": "137",
                "owner": "0x27F7e8d7C63C414Eae2BB07E1a9B9057a1D382cf"
            },
        }
    ]
}'
```


## Running Tests

###  Testing Smart Contracts

`npx hardhat test`

Test a specific feature: `npx hardhat test --grep unListMarketItem`

Sometimes you might try to run a test or a piece of code and find that a function is undefined. This might be due to an outdated artifacts build. Run `npx hardhat compile --force` to force a recompilation.

## Deploying smart contracts
1. Compile the smart contracts to get the most recent change: `npx hardhat compile`
1. Load your environment variables using `shared.env` as a template

## Deployment
1. Deploys to AWS Lambda
    - [Staging Lambda Console](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/arthouse-server-staging-saveNFTAPI)
    - Set environment variables: `INFURA_API_KEY` and `CONTRACT_DEPLOYMENT_WALLET_PRIVATE_KEY`


## Run Hardhat in Console

To quickly run commands you can use the interactive hardhat console

`npx hardhat console`

```bash
const [ownerSigner, signer1, signer2] = await ethers.getSigners();
const ownerBalance = await ethers.provider.getBalance(ownerSigner.address);
```

### Set up your Backend

1. If you won't be deploying to a test net or mainnet, go to `hardhat.config.js` and comment out `privateKey` and all the networks  except for `networks.hardhat`

1. Put your private keys for the account that will be deploying the smart contract in a `.secrets` file. This will NOT be included in your version control. You can get the key from `shared.secrets` and run `cp shared.secrets .secrets` and replace the private key.

1. Load the secret key `source .secrets`

1. Compile the smart contracts to get the most recent change: `npx hardhat compile`

1. Run your own local blockchain node using: `npx hardhat node`

## Backend

## Deploying Smart Contracts

### Deploying Locally

1. Run smart contract deployment script: `npx hardhat run scripts/deploy.js --network localhost`

### Deploying to Testnet or Mainnet

1. Put your private keys for the account that will be deploying the smart contract in `.secrets`. This will NOT be included in your version control and run `source .secrets`.

1. Add the chain information to `src/config-chains.json`
    1. Get Chain ID from:
        1. https://chainlist.org/
    1. Get an RPC URL for your desired blockchain (TODO: where to get good RPC urls)
        1. Binance: https://docs.binance.org/smart-chain/developer/rpc.html (TODO: add other chains)
    1. Add the apikey to `.secrets`

1. Get some tokens to pay the gas fees for deploying the smart contracts. On testnets you can use a faucet:
    1. Ethereum Rinkeby: https://rinkebyfaucet.com
    1. Binance: https://testnet.binance.org/faucet-smart
    1. Polygon: https://faucet.polygon.technology
    1. Celo: https://celo.org/developers/faucet

1. Load secrets to your environment variable `source .secrets`

1. Deploy the smart contract: `npx hardhat deploy --chain-id [chainId]`
    1. If you want to deploy just the NFT or the Market without deploying everything run:
        1.  `npx hardhat deploy:nft --chain-id [chainId]`
        1.  `npx hardhat deploy:market --chain-id [chainId]`
    1. Here are some examples:
    1. Ethereum Rinkeby: `npx hardhat deploy --chain-id 4`
    1. Ethereum Rinkeby NFT only: `npx hardhat deploy:nft --chain-id 4`
    1. Binance Smart Chain Testnet: `npx hardhat deploy --chain-id 97`
    1. Polygon Mumbai: `npx hardhat deploy --chain-id 80001`

If the deploy script is not working you can also us the default hardhat deployment script. Make sure to update the CHAIN ID variable:
TODO add a check that chainID matches the passed in network
 
`npx hardhat run --network polygon scripts/deploy-hardhat.js`

1. Add the new chain information to `README.md`, see these commits below for examples of what to change:
    1. [Ethereum](https://github.com/atilatech/art-house/commit/d97572f9d730a3a469a712dec04fc3ea6dc97eb8)
    1. [Binance](https://github.com/atilatech/art-house/commit/274ff640c116d6637add521e7eae7fe9de2fbe92)
    1. [Polygon](https://github.com/atilatech/art-house/commit/a211ac1bc50d52ffd266b5eb5fd47bf4b232d366)
    1. [Celo](https://github.com/atilatech/art-house/commit/af8ab520fe80c3a148e45a963ead9270e2710a80)

### Verifying Smart Contract on Etherscan (BSCScan, PolygonScan etc.)

1. Get Etherscan API Key: https://etherscan.io/myapikey
    1. Similar process for BSC Scan, PolygonScan etc
1. Set environment variable in `.secrets`: `export ETHERSCAN_API_KEY=""`
1. `npx hardhat verify --network rinkeby [smart_contract_address_you_just deployed]`
    1. Example: `npx hardhat verify --network rinkeby 0x5f3cc650c751fa194f0d1537ecfbb55a2c40a995`
    1. To see a list of other networks: `npx hardhat verify --list-networks`

Note: That the `hardhat.config.js` expects the network name to be camelcase e.g. `bscTestnet: BSCSCAN_API_KEY`,
but when you run the command it should be all lowercase: `npx hardhat verify --network bscTestnet [ADDRESS]`
### Adding a New Chain

1. Add the chain information to `src/config-chains.json`
    1. Get Chain ID from:
        1. https://chainlist.org/
    1. Get an RPC URL for your desired blockchain (TODO: where to get good RPC urls)
        1. Binance: https://docs.binance.org/smart-chain/developer/rpc.html (TODO: add other chains)
    1. Add the apikey to `.secrets`

1. Get some tokens to pay the gas fees for deploying the smart contracts. On testnets you can use a faucet:
    1. Ethereum Rinkeby: https://rinkebyfaucet.com
    1. Binance: https://testnet.binance.org/faucet-smart
    1. Polygon: https://faucet.polygon.technology
    1. Celo: https://celo.org/developers/faucet

### Smart Contract Addresses

- [View  Ethereum (Rinkeby)  NFT Contract on Block Explorer](https://rinkeby.etherscan.io/token/0x544FEc06fdfB423606d1C705D3105867B8Ff8148)
    - Note: We use Ethereum Rinkeby because that's what Opensea uses, so our testnet NFTs will also be visible on Opensea.
- [View  Binance Smart Chain (Testnet)  NFT Contract on Block Explorer](https://testnet.bscscan.com/token/0x5216962D1308AA3de2e89c969dacc1B2F798EaB5)
- [View  Polygon (Mumbai)  NFT Contract on Block Explorer](https://mumbai.polygonscan.com/token/0x5216962D1308AA3de2e89c969dacc1B2F798EaB5)
- [View  Celo (Alfajores)  NFT Contract on Block Explorer](https://alfajores-blockscout.celo-testnet.org/token/0x5216962D1308AA3de2e89c969dacc1B2F798EaB5)
<!-- END_SMART_CONTRACT_ADDRESSES -->

#### Troubleshooting

If you see, the following doublecheck you set the correct credentials for your RPC URL:
```
Invalid JSON-RPC response received: {
  "message":"Invalid authentication credentials"
}
```

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
