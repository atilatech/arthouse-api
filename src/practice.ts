import { getProvider } from "./utils/network-helpers"

const chainId = "137"
const provider = getProvider(chainId);

provider.getGasPrice();

export const main = async () => {

    const gasPrice = await provider.getGasPrice();
    const feeData = await provider.getFeeData();

    console.log("gasPrice", gasPrice);
    console.log("feeData",feeData);
};

main();