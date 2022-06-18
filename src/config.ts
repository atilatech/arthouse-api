// this file is auto-generated each time scripts/deploy.js is run
import configChains from './config-chains.json';
import { Chain } from './models/Chain';


export const ALL_CONFIG_CHAINS: {[key: string]: Chain} =  (configChains as any);

delete ALL_CONFIG_CHAINS.localhost;
export let CONFIG_CHAINS: {[key: string]: Chain} = {};

// if the URL starts with art.atila.ca' then only show mainnet chains

const environmentName = process.env.REACT_ENVIRONMENT_NAME || 8008;
Object.values(ALL_CONFIG_CHAINS)
// comment the following line if you want to test with all chains without filtering any chains out
// .filter(chain => environmentName === "prod" ? chain.IS_MAIN_NET : !chain.IS_MAIN_NET)
.forEach(chain => {
    CONFIG_CHAINS[chain.CHAIN_ID] = chain;
});
