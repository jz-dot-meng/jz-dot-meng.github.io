import * as polkadot from '@polkadot/api';
import { NextApiRequest, NextApiResponse } from "next";


const dotReturnBalance =async (ADDR:string, response:NextApiResponse) =>{
    try {
        // constuct a uri using a public node
        const wsProvider = new polkadot.WsProvider('wss://rpc.polkadot.io');
        // async api shenanigans... create Api instance and wait until it is ready/connected
        const api = await polkadot.ApiPromise.create({ provider: wsProvider });

        // Polkadot uses api.query.<module>.<method> interface

        // retrieve last timestamp using the 'timestamp' module, wait till it is returned
        const now = await api.query.timestamp.now();

        // retrieve stash account balance & nonce(?) using the system module
        // @ts-ignore
        const { nonce, data: balance } = await api.query.system.account(ADDR);

        const dotDecimal = 10 ** 10
        response.json({ "Message": "Successfully opened a Polkadot connection and retrieved address details", "Address": ADDR, "Balances": [{ "Asset_code": "DOT", "Balance": parseInt(balance.free) / dotDecimal, "Asset_type": "native" }], "Nonce": parseInt(nonce) });
        wsProvider.disconnect();
    } catch (e) {
        response.status(500).json({ "Message": `Error in retreiving balance, returned message from websocket provider: ${e}` })
    }
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    const {address} = req.query
    await dotReturnBalance(address as string, res)
}