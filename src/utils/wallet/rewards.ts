import { addRewardHistory } from "../../redux/wallet/actions/addressActions";
import { addHistoricPrices } from "../../redux/wallet/actions/tokenPriceActions";
import { store } from "../../redux/wallet/store";

export const fetchAllRewardData = (blockchain: string, address: string) => {
    checkAddressForRewards(blockchain, address).then(data => {
        if (data === undefined) {
            console.log('no data returned....')
            return;
        }
        // find start and end dates
        const startDate = data['Rewards'][0]['reward_date'];
        const finalInd = data['Rewards'].length - 1
        const endDate = data['Rewards'][finalInd]['reward_date'];
        getHistoricPrices(blockchain, startDate, endDate);
    })
}

const checkAddressForRewards = async (blockchain: string, address: string): Promise<any> => {
    const url = `https://jz-dot-meng-wbapi.herokuapp.com/${blockchain.toLowerCase()}/rewards/${address}`
    return fetch(url).then(async resp => {
        if (resp.status !== 200) {
            console.warn(resp)
            return undefined
        }
        const data = await resp.json();
        if (data['Rewards'].length === 0) {
            // no rewards
            return undefined;
        }
        const payload = {
            [address]: {
                blockchain,
                'rewards': data['Rewards']
            }
        }
        store.dispatch(addRewardHistory(payload))
        return data
    }).catch(e => {
        console.warn(e)
        return undefined;
    })
}

const getHistoricPrices = async (token: string, startDate: string, endDate: string) => {
    const state = store.getState()
    const currency = state.crypto.currencyCoversion.currency
    const startDateParse = new Date(startDate);
    const startDateMs = Date.UTC(startDateParse.getFullYear(), startDateParse.getMonth(), startDateParse.getDay())
    const endDateParse = new Date(endDate);
    const endDateMs = Date.UTC(endDateParse.getFullYear(), endDateParse.getMonth(), endDateParse.getDay())
    console.log({ startDate, startDateMs, endDate, endDateMs, token })
    const url = `https://jz-dot-meng-wbapi.herokuapp.com/historic&token=${token}&currency=${currency}&start=${startDateMs / 1000}&end=${endDateMs / 1000}`
    fetch(url).then(async resp => {
        const data = await resp.json();
        console.log(data)
        store.dispatch(addHistoricPrices({ token, currency, data: data.data }))
    }).catch(e => {
        console.warn(e)
    })
}