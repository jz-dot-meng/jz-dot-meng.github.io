
//styling
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TokenBalancePayload } from '../../../redux/wallet/actions/addressActions';
import { ReduxRootState } from '../../../redux/wallet/store';
import { getRewardTickerFromBlockchain } from '../../../utils/blockchain/string';
import { calculateApyFromRewardAndTotal } from '../../../utils/finance/interest';
import './StakingRewardDetails.css'

type StakingRewardDetailsType = {
    blockchain: string;
    address: string;
    rewards: { 'reward_date': string, 'reward_amount': number }[]
}

export const StakingRewardDetails: React.FunctionComponent<StakingRewardDetailsType> = ({ ...props }) => {
    const { blockchain, address, rewards } = props

    const balances = useSelector((state: ReduxRootState) => state.crypto.addressTracker.balances)

    const sumArray = (a: number, b: number) => a + b

    useEffect(() => {
        // find correct address
        const addr = balances.token[blockchain].filter((addresses: { [address: string]: TokenBalancePayload }) => addresses.hasOwnProperty(address))[0]
        // get ticker
        const ticker = getRewardTickerFromBlockchain(blockchain)
        setTicker(ticker)
        // get wallet balance
        const tokenBalances = addr[address].filter(tokenTicker => tokenTicker.hasOwnProperty(ticker)).map(data => Number(data[ticker]))
        const totalBalance = tokenBalances.reduce(sumArray)
        setWalletBalance(totalBalance)
        // set rewards accumulated
        const rewardTokenArr = rewards.map(item => Number(item['reward_amount']));
        let rewardTokenSum = rewardTokenArr.reduce(sumArray)
        setRewardSum(rewardTokenSum)
        // find av daily reward
        const firstRewardDate = new Date(rewards[0]['reward_date']).getTime(); // to unix
        const now = Date.now()
        const daysSinceFirstReward = Math.floor((now - firstRewardDate) / (1000 * 60 * 60 * 24))
        let avDaily = rewardTokenSum / daysSinceFirstReward
        setAverageReward(avDaily)
        // apy based on last reward
        let roughPeriod = 365 * (rewards.length / daysSinceFirstReward)
        if (ticker === 'ALGO') {
            roughPeriod = 4 // HACK - fixme, algo shows obscenely high numbers based on last reward
        }
        let last = calculateApyFromRewardAndTotal(rewards[rewards.length - 1]['reward_amount'], totalBalance, roughPeriod)
        setLastApy(last);
        // apy based on average
        let avApy = calculateApyFromRewardAndTotal(avDaily, totalBalance)
        setAverageApy(avApy)
        // eslint-disable-next-line
    }, [rewards])

    const [walletBalance, setWalletBalance] = useState<number>(0)
    const [rewardSum, setRewardSum] = useState<number>(0)
    const [averageReward, setAverageReward] = useState<number>(0)
    const [ticker, setTicker] = useState<string>('')
    const [lastApy, setLastApy] = useState<number>(0);
    const [averageApy, setAverageApy] = useState<number>(0)

    return (
        <>
            <div className='rewardDetails-container'>
                <div className='rewardDetail-heading'>Wallet balance</div>
                <div className='rewardDetail-data'>{`${walletBalance} ${ticker}`}</div>


                <div className='rewardDetail-heading'>Total rewards accumulated to date</div>
                <div className='rewardDetail-data'>{`${rewardSum.toFixed(6)} ${ticker}`}</div>


                <div className='rewardDetail-heading'>Average daily reward (since first reward)</div>
                <div className='rewardDetail-data'>{`${averageReward.toFixed(6)} ${ticker}`}</div>


                <div className='rewardDetail-heading'>APY based on last reward</div>
                <div className='rewardDetail-data'>{`${lastApy.toFixed(4)}%`}</div>


                <div className='rewardDetail-heading'>APY based on average reward</div>
                <div className='rewardDetail-data'>{`${averageApy.toFixed(4)}%`}</div>


            </div>
        </>
    )
}