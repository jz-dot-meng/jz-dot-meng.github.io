import { createReducer } from "@reduxjs/toolkit"
import { CryptoAddressPayload, addWalletAddress, removeWalletAddress, CryptoBalancePayload, setWalletBalance, setWalletFiatBalance, addRewardHistory } from "../actions/addressActions"

interface AddressState {
    addresses: CryptoAddressPayload[];
    balances: {
        token: CryptoBalancePayload,
        fiat: CryptoBalancePayload
    };
    rewards: any
}

const initialState: AddressState = {
    addresses: [],
    balances: {
        token: {},
        fiat: {}
    },
    rewards: {}
}


export const addressReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(
            addWalletAddress, (state, action) => {
                state.addresses.push(action.payload);
            }
        )
        .addCase(
            removeWalletAddress, (state, action) => {
                // remove from addresses
                const index = state.addresses.map(item => item.address).indexOf(action.payload.address);
                state.addresses.splice(index, 1)
                // remove from balances
                const balanceIndex = state.balances.token[action.payload.blockchain].map(item => Object.keys(item)[0]).indexOf(action.payload.address);
                state.balances.token[action.payload.blockchain].splice(balanceIndex, 1)
                state.balances.fiat[action.payload.blockchain].splice(balanceIndex, 1)
                // remove from rewards
                if (state.rewards[action.payload.address] !== undefined) {
                    delete state.rewards[action.payload.address]
                }
            }
        )
        .addCase(
            setWalletBalance, (state, action) => {
                if (state.balances.token[action.payload.blockchain] === undefined) {
                    state.balances.token[action.payload.blockchain] = action.payload.walletTokens
                } else {
                    state.balances.token[action.payload.blockchain].push(...action.payload.walletTokens)
                }
            }
        )
        .addCase(
            setWalletFiatBalance, (state, action) => {
                if (state.balances.fiat[action.payload.blockchain] === undefined) {
                    state.balances.fiat[action.payload.blockchain] = action.payload.walletFiat
                } else {
                    state.balances.fiat[action.payload.blockchain].push(...action.payload.walletFiat)
                }
            }
        )
        .addCase(
            addRewardHistory, (state, action) => {
                const addr = Object.keys(action.payload)[0]
                state.rewards[addr] = action.payload[addr];
            }
        )
})