import { NextApiRequest, NextApiResponse } from "next";

const tezReturnBalance=async (ADDR:string, response:NextApiResponse) =>{
    try {
        const data = await fetch("https://api.tzstats.com/explorer/account/" + ADDR);
        if (data.ok) {
            let json = await data.json();
            // console.log('tez wallet balance', json)
            response.json({ "Message": "Successfully connected to the TzStats API and retrieved address details", "Address": ADDR, "Balances": [{ "Asset_code": "XTZ", "Balance": json["spendable_balance"], "Asset_type": "native" }] })
        }
    } catch (e) {
        response.json({ "Message": `Error in retrieving balance, returned message from server: ${e}` });
    }
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    const {address} = req.query
    await tezReturnBalance(address as string, res)
}