import { fetchAndSetAllWalletData } from "./balance";
import { fetchAllRewardData } from "./rewards";

/**
 * Checks whether address string exists on the chain; if valid 
 * @param blockchain blockchain to check on
 * @param address wallet address
 * @returns boolean of whether address exists or not on the chosen chain
 */
export const validateAddress = async (blockchain: string, address: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const url = `https://jz-dot-meng-wbapi.herokuapp.com/${blockchain.toLowerCase()}/address/${address}`
        fetch(url, {
            method: 'GET'
        }).then(async (response) => {
            if (response.status === 200) {
                const data = await response.json();
                console.log(data)
                fetchAndSetAllWalletData(blockchain, address, data);
                fetchAllRewardData(blockchain, address)
                resolve(true)
            } else {
                // not a valid address
                resolve(false)
            }
        }).catch(e => {
            console.warn(e)
            reject(e.toString())
        })

    })
}