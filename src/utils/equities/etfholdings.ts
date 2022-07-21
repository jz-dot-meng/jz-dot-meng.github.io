import { addEtfHoldings } from "../../redux/equities/actions/etfOverlapActions"
import { store } from "../../redux/store"

export const fetchHoldings = async (ticker: string) => {
    return new Promise((resolve, reject) => {
        const url = `${process.env.REACT_APP_ETFOVERLAP_API}/etf/holdings/${ticker}`
        // console.log('fetching from url', url)
        fetch(url, {
            method: 'GET'
        }).then(async (response) => {
            if (response.status === 200) {
                const data = await response.json();
                // console.log(data)
                store.dispatch(addEtfHoldings(data))
                resolve(data)
            }
            else {
                resolve(undefined)
            }
        }).catch(err => {
            console.warn(err)
            resolve(undefined)
        })
    })
}