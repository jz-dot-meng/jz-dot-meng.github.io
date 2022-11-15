import { NextApiRequest, NextApiResponse } from "next";
import { ALGO_GOV_REWARD } from "pages/api/utils/constants";

const algoReturnRewards = async (ADDR:string, response:NextApiResponse)=> {
    // console.log('fetching algo rewards')
    fetch(`https://algoindexer.algoexplorerapi.io/v2/accounts/${ADDR}/transactions`)
        .then(async resp => {
            let dataObj:{Message:string,Address:string,Rewards:any[]} = { "Message": "Successfully connected to the AlgoExplorer indexer API and retrieved address governance rewards", "Address": ADDR, "Rewards": [] };
            let json = await resp.json();
            let transactionArr:any = json.transactions;
            transactionArr.forEach((transaction:any) => {
                if (transaction.sender === ALGO_GOV_REWARD) {
                    const amount = transaction['payment-transaction']['amount'] / (10 ** 6)
                    const dateInMS = transaction['round-time'] * 1000 // convert second to millisecond
                    const date = new Date(dateInMS).toDateString()
                    dataObj.Rewards.push({ 'reward_date': date, 'reward_amount': amount })
                }
            })
            if (dataObj.Rewards.length === 0) {
                const data = JSON.parse(JSON.stringify(dataObj));
                response.json(data);
                return
            }
            let final = JSON.parse(JSON.stringify(dataObj));
            response.json(final);
        }).catch(e => {
            response.status(500).json({ "Message": `Error in retrieving rewards, returned message from server: ${e}` });
        })
}


export default async (
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    const {address} = req.query
    await algoReturnRewards(address as string, res)
}