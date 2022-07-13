const { getAvailableChains } = require("./helpers");
const fs = require('fs');

function addChainsInfoToReadme() {
    const chains = getAvailableChains();

    const readmeFilePath = './README.md';
    let readmeFile = fs.readFileSync(readmeFilePath, 'utf8');

    let chainConfigRegex = /### Smart Contract Addresses(.|\n)*<!-- END_SMART_CONTRACT_ADDRESSES -->/gm;

    const generatedConfigInfo = generateConfigInfo(chains);

    const configInfo = `### Smart Contract Addresses\n\n${generatedConfigInfo}\n<!-- END_SMART_CONTRACT_ADDRESSES -->`
    const updatedReadme = readmeFile.replace(chainConfigRegex, configInfo);
    console.log({ generatedConfigInfo, configInfo, updatedReadme });

    fs.writeFileSync(readmeFilePath, updatedReadme);

}

function generateConfigInfo(chains) {

    let configInfo = Object.values(chains).map(chain => (
        `#### ${chain.CHAIN_NAME} ${chain.NETWORK_NAME}\n`+
        `- [Smart Contract](${chain.BLOCK_EXPLORER_URL}/address/${chain.NFT_ADDRESS})\n`+
        `- Chain ID: ${chain.CHAIN_ID}`+ 
        (chain.FAUCET_URLS?.length > 0 ? `\n- Faucets: ${chain.FAUCET_URLS?.join('')}` : "") + "\n"
    ));

    return configInfo.join("\n")
}

module.exports = {
    addChainsInfoToReadme,
    generateConfigInfo
}

addChainsInfoToReadme()