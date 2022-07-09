import { createAction } from "@reduxjs/toolkit"

import * as types from '../../../constants'

export type CryptoAddressPayload = {
    blockchain: string,
    address: string
};

export type TokenBalancePayload = { [token: string]: number }[]
export type WalletTokenPayload = { [address: string]: TokenBalancePayload }[]
export type CryptoBalancePayload = { [blockchain: string]: WalletTokenPayload }

export type RewardPayload = { 'reward_date': string, 'reward_amount': number }[]
export type TokenRewardPayload = { blockchain: string, 'rewards': RewardPayload }
export type WalletRewardPayload = { [address: string]: TokenRewardPayload }

export const addWalletAddress = createAction<CryptoAddressPayload>(types.ADD_WALLET_ADDRESS)
export const removeWalletAddress = createAction<CryptoAddressPayload>(types.REMOVE_WALLET_ADDRESS)

export const setWalletBalance = createAction<{ blockchain: string, walletTokens: WalletTokenPayload }>(types.SET_WALLET_BALANCE)
export const setWalletFiatBalance = createAction<{ blockchain: string, walletFiat: WalletTokenPayload }>(types.SET_WALLET_FIAT_BALANCE)

export const addRewardHistory = createAction<WalletRewardPayload>(types.ADD_REWARD_HISTORY)