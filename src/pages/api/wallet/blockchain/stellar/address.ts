import { NextApiRequest, NextApiResponse } from "next";
import stellar from 'stellar-sdk';

const xlmReturnBalances= async(ADDR:string, response:NextApiResponse)=> {
    try {
        const server = new stellar.Server("https://horizon.stellar.org");

        let dataObj:{Message:string,Address:string,Balances:any[]} = { "Message": "Successfully opened a Stellar connection and retrieved address details", "Address": ADDR, "Balances": [] };

        // alternative method to the .call().then() / callbuilder method
        const resp = await server.loadAccount(ADDR);
        let balances = resp.balances;
        for (let i = 0; i < balances.length; i++) {
            if (balances[i]['asset_type'] == 'liquidity_pool_shares') {
                const liquidityPool = await server.liquidityPools().liquidityPoolId(balances[i]['liquidity_pool_id'])
                    .call()
                    .then(async function (resp:any) {
                        let poolPercentage = balances[i]['balance'] / resp['total_shares'];
                        let poolName = '';
                        let data:Record<string,any> = {
                            "Liquidity_pool": '',
                            "Balance": balances[i]['balance'],
                            "Pool_percentage": poolPercentage,
                            "Current_pooled_asset": [],
                            "Asset_type": balances[i]["asset_type"]
                        };
                        // create xlm asset object for price comparison to xlm
                        const xlm = new stellar.Asset.native();
                        for (let i = 0; i < resp.reserves.length; i++) {
                            let assetName;
                            let assetIssuer = '';
                            // check if XLM to x pool;
                            if (resp.reserves[i].asset !== 'native') {
                                assetName = resp.reserves[i].asset.substring(0, resp.reserves[i].asset.indexOf(':'));
                                assetIssuer = resp.reserves[i].asset.substring(resp.reserves[i].asset.indexOf(':') + 1, resp.reserves[i].asset.length)
                            } else {
                                assetName = "XLM";
                            }
                            poolName += assetName;
                            // base object for 'Current_pooled_asset'
                            let poolAsset:Record<string,any> = {
                                "Asset_code": assetName,
                                "Balance": poolPercentage * resp.reserves[i].amount,
                            }
                            // check xlm value for non-xlm assets
                            if (assetName !== "XLM") {
                                const lpOrderBook = await server.orderbook(new stellar.Asset(assetName, assetIssuer), xlm)
                                    .call()
                                    .then(function (lpresp:any) {
                                        poolAsset["Latest_bid_to_xlm"] = lpresp.bids[0]['price'];
                                    })
                                    .catch(function (e:any) {
                                        poolAsset["Latest_bid_to_xlm"] = 'not_available';
                                        poolAsset["Reason"] = JSON.stringify(e);
                                    })
                            }
                            data['Current_pooled_asset'].push(poolAsset)
                        }
                        data['Liquidity_pool'] = poolName;
                        dataObj["Balances"].push(data);
                    }).catch(function (e:any) {
                        dataObj["Balances"].push({
                            "Liquidity_pool": 'not_available',
                            "Balance": balances[i]["balance"],
                            "Current_pooled_asset": 'not_available',
                            "Asset_type": balances[i]["asset_type"],
                            "Reason": e,
                        });
                    })
            }
            else if (balances[i]["asset_type"] == 'native') {
                dataObj["Balances"].push({
                    "Asset_code": "XLM",
                    "Balance": balances[i]["balance"],
                    "Asset_type": balances[i]["asset_type"]
                });
            } else {
                const orderBook = await server.orderbook(new stellar.Asset(balances[i]["asset_code"], balances[i]["asset_issuer"]), new stellar.Asset.native())
                    .call()
                    .then(function (resp:any) {
                        dataObj["Balances"].push({
                            "Asset_code": balances[i]["asset_code"],
                            "Balance": balances[i]["balance"],
                            "Asset_type": balances[i]["asset_type"],
                            "Latest_bid_to_xlm": resp.bids[0]["price"]
                        });
                    }).catch(function (e:any) {
                        dataObj["Balances"].push({
                            "Asset_code": balances[i]["asset_code"],
                            "Balance": balances[i]["balance"],
                            "Asset_type": balances[i]["asset_type"],
                            "Latest_bid_to_xlm": "not_available",
                            "Reason": JSON.stringify(e)
                        });
                    })
            }
        }
        let finaldata = JSON.parse(JSON.stringify(dataObj));
        response.json(finaldata);
    } catch (e) {
        response.status(500).json({ "Message": `Error in retrieving balance, returned message from server: ${e}` });
    }
    /*
        Balances:[
            {
                Liquidity_pool: XXXX,
                Balance: 0000,
                Pool_percentage: 0000
                Current_Pool_Asset: [
                    {
                        Asset_code:
                        Balance:
                        Latest_bid_to_xlm
                    }
                ]
                Asset_type: 'liquidity_pool_shares'
            },
            {
                Asset_code: xxxx
                Balance: 0000
                Asset_type: xxxx
                Latest_bid_to_xlm: 0000
            }
        ]

    */
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    const {address} = req.query
    await xlmReturnBalances(address as string, res)
}