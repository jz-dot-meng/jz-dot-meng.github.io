import { NextApiRequest, NextApiResponse } from "next";

const algoReturnBalance = async (ADDR:string, response:NextApiResponse)=> {
    // const asaTracker = [];
    fetch("https://algoindexer.algoexplorerapi.io/v2/accounts/" + ADDR)
        .then(async (resp) => {
            let dataObj:{Message:string, Address:string, Balances:any[]} = { "Message": "Successfully connected to the AlgoExplorer indexer API and retrieved address details", "Address": ADDR, "Balances": [] };
            let json = await resp.json();
            const algoDecimals = 10 ** 6;
            // ALGO in wallet
            const algoBaseAmount = json['account']['amount'] / algoDecimals;
            dataObj['Balances'].push({ "Asset_code": "ALGO", "Balance": algoBaseAmount, "Asset_type": "native" });
            // assets
            let asaAssets = json['account']['assets']; // array of assets

            if (!asaAssets) {
                // no other assets
                return dataObj
            }
            for (let i = 0; i < asaAssets.length; i++) {
                const asaId = asaAssets[i]['asset-id'];
                const asaAssetData = await fetch(`https://algoindexer.algoexplorerapi.io/v2/assets/${asaId}`)
                    .then(async (asaResp) => {
                        let asaJson = await asaResp.json();
                        const asaDecimals = 10 ** asaJson['asset']['params']['decimals'];
                        const asaAmount = asaAssets[i]['amount'] / asaDecimals;
                        dataObj['Balances'].push({ "Asset_code": asaJson['asset']['params']['unit-name'], 'Balance': asaAmount });
                        // // add to tracker
                        // asaTracker.push({ id: asaId, tokenName: asaJson['asset']['params']['unit-name'], tokenDecimals: asaJson['asset']['params']['decimals'] })
                    })
            }
            // ALGO/assets locked in contracts
            // address base64 -> string             app base64 -> string, applications can design their own keys, but generall have GT, GA, GSS?
            // VVQ= -> UT (user time)               R1Q= -> GT (global time)
            // VUE= -> UA (user amount)             ROE= -> GA (global amount)
            // VVNT -> USS (user staked share)      R1NT -> GSS (global shares)
            //                                      VFIM -> TYL (total [yieldly] locked?) // specific to yieldly's app
            //                                      VFlVTA== => TYUL (total [yieldly] unlocked?) // specific to yieldly's app
            // let userInteractedApps = json['account']['apps-local-state'];
            // for (let i = 0; i < userInteractedApps.length; i++) {
            //     const appId = userInteractedApps[i]['id'];
            //     const appData = await fetch(`https://algoindexer.algoexplorerapi.io/v2/applications/${appId}`)
            //         .then(async (appResp) => {
            //             // check for escrow account?
            //             let appJson = await appResp.json();
            //             let globalState = appJson['application']['params']['global-state'];
            //             let escrow;
            //             if (globalState !== undefined)
            //                 escrow = globalState.find(value => Buffer.from(value['key'], 'base64').toString() === 'E' || Buffer.from(value['key'], 'base64').toString() === 'Address'); // specific to yieldly
            //             const contractTokens = [];
            //             if (escrow !== undefined) {
            //                 // lookup escrow account and find tokens
            //                 let decodedAddr = algosdk.encodeAddress(Buffer.from(escrow['value']['bytes'], 'base64'));
            //                 console.log('escrowaddr:', decodedAddr);
            //                 const escrowAccount = await fetch(`https://algoindexer.algoexplorerapi.io/v2/accounts/${decodedAddr}`)
            //                     .then(async (escrowResp) => {
            //                         let escrowjson = await escrowResp.json();
            //                         if (escrowjson['account']['amount'] > 20 * 10 ** 6) { // arbitrary amount, if algo-x pool, locked algo would be significantly higher
            //                             contractTokens.push({ id: 'base', tokenName: 'ALGO', tokenDecimals: 6 });
            //                             // check if assets already in tokentracker to prevent extraneous token calls
            //                             let checkToken2 = asaTracker.find(value => value.id === escrowjson["account"]['assets'][0]['asset-id']);
            //                             if (checkToken2 !== undefined) {
            //                                 contractTokens.push(checkToken2);
            //                             } else {
            //                                 const tokenTwoCall = await fetch(`https://algoindexer.algoexplorerapi.io/v2/assets/${escrowjson["account"]['assets'][0]['asset-id']}`)
            //                                     .then(async (tokenResp) => {
            //                                         let asaJson = await tokenResp.json();
            //                                         asaTracker.push({ id: escrowjson["account"]['assets'][0]['asset-id'], tokenName: asaJson['asset']['params']['unit-name'], tokenDecimals: asaJson['asset']['params']['decimals'] })
            //                                     })
            //                             }
            //                         } else {
            //                             // two different tokens
            //                             if (escrowjson["account"]['assets'].length > 1) {
            //                                 for (let i = 0; i < escrowjson["account"]['assets'].length; i++) {
            //                                     let checkToken = asaTracker.find(value => value.id === escrowjson["account"]['assets'][0]['asset-id']);
            //                                     if (checkToken !== undefined) {
            //                                         contractTokens.push(checkToken);
            //                                     } else {
            //                                         const tokenCall = await fetch(`https://algoindexer.algoexplorerapi.io/v2/assets/${escrowjson["account"]['assets'][0]['asset-id']}`)
            //                                             .then(async (tokenResp) => {
            //                                                 let asaJson = await tokenResp.json();
            //                                                 asaTracker.push({ id: escrowjson["account"]['assets'][0]['asset-id'], tokenName: asaJson['asset']['params']['unit-name'], tokenDecimals: asaJson['asset']['params']['decimals'] })
            //                                             })
            //                                     }
            //                                 }
            //                             } else {
            //                                 for (let i = 0; i < escrowjson["account"]['assets'].length; i++) {
            //                                     let checkToken = asaTracker.find(value => value.id === escrowjson["account"]['assets'][0]['asset-id']);
            //                                     if (checkToken !== undefined) {
            //                                         contractTokens.push(checkToken);
            //                                         contractTokens.push(checkToken);
            //                                     } else {
            //                                         const tokenCall = await fetch(`https://algoindexer.algoexplorerapi.io/v2/assets/${escrowjson["account"]['assets'][0]['asset-id']}`)
            //                                             .then(async (tokenResp) => {
            //                                                 let asaJson = await tokenResp.json();
            //                                                 asaTracker.push({ id: escrowjson["account"]['assets'][0]['asset-id'], tokenName: asaJson['asset']['params']['unit-name'], tokenDecimals: asaJson['asset']['params']['decimals'] });
            //                                                 asaTracker.push({ id: escrowjson["account"]['assets'][0]['asset-id'], tokenName: asaJson['asset']['params']['unit-name'], tokenDecimals: asaJson['asset']['params']['decimals'] })
            //                                             })
            //                                     }
            //                                 }
            //                             }
            //                         }
            //                     })
            //             }
            //             let userAmount, userTime, userStakedShare;
            //             console.log(asaTracker);
            //             const keyValArr = userInteractedApps[i]['key-value'];
            //             console.log('keyvalarr', keyValArr)
            //             if (keyValArr !== undefined) {
            //                 for (let i = 0; i < keyValArr.length; i++) {
            //                     const key = new Buffer.from(keyValArr[i].key, 'base64').toString();
            //                     console.log(key);
            //                     if (key === 'UT')
            //                         userTime = keyValArr[i].value.uint; //? value.value.uint : 0;

            //                     if (key === 'UA')
            //                         userAmount = keyValArr[i].value.uint //? value.value.uint : 0;

            //                     if (key === 'USS')
            //                         userStakedShare = keyValArr[i].value.uint //? value.value.uint : 0;

            //                 }
            //             }
            //             if (userAmount != null) {
            //                 let appTokens = '';
            //                 for (let i = 0; i < contractTokens.length; i++) {
            //                     appTokens += contractTokens[i].tokenName;
            //                 }
            //                 dataObj['Balances_In_Applications'].push({ 'Locked_Balance': userAmount / 10 ** contractTokens[0].tokenDecimals, 'Application_Id': appId, 'Escrow_Tokens': appTokens })
            //             }
            //         })
            // }
            return dataObj;
        }).then((dataObj) => {
            let final = JSON.parse(JSON.stringify(dataObj));
            response.json(final);
        }).catch((e) => {
            response.status(500).json({ "Message": `Error in retrieving balance, returned message from server: ${e}` });
        })
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    const {address} = req.query
    await algoReturnBalance(address as string, res)
}