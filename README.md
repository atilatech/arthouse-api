# Arthouse Server

Programmatically create NFTs.

## Quickstart

`yarn install`

`yarn dev`

## Demo

```bash
curl --location --request POST 'http://127.0.0.1:8008/api/v1/nft' \
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
```

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
