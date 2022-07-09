import { WalletGraph } from "../../chart/crypto/WalletGraph"

type StakingRewardsTabContentType = {
    blockchain: string;
    rewards: { 'reward_date': string, 'reward_amount': number }[];
}

export const StakingRewardsTabContent: React.FunctionComponent<StakingRewardsTabContentType> = ({ ...props }) => {
    const { blockchain, rewards } = props

    return (
        <>
            {rewards.length > 0 ?
                <WalletGraph blockchain={blockchain} rewards={rewards} />
                : <></>
            }
        </>
    )
}