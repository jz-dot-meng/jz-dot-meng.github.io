import { WalletGraph } from "../../chart/crypto/WalletGraph"
import { StakingRewardDetails } from "./StakingRewardDetails";

//styling
import './StakingRewardsTabContent.css'

type StakingRewardsTabContentType = {
    blockchain: string;
    address: string;
    rewards: { 'reward_date': string, 'reward_amount': number }[];
}

export const StakingRewardsTabContent: React.FunctionComponent<StakingRewardsTabContentType> = ({ ...props }) => {
    const { blockchain, address, rewards } = props

    return (
        <>
            {rewards.length > 0 ?
                <div className='rewards-tabContent-container'>
                    <div className="rewards-tabContent-graph">
                        <WalletGraph blockchain={blockchain} rewards={rewards} />
                    </div>
                    <div className="rewards-tabContent-details">
                        <StakingRewardDetails blockchain={blockchain} address={address} rewards={rewards} />
                    </div>
                </div>
                : <></>
            }
        </>
    )
}