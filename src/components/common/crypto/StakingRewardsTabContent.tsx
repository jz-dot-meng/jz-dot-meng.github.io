import { WalletGraph } from "../../chart/crypto/WalletGraph";
import { StakingRewardDetails } from "./StakingRewardDetails";

//styling
import styles from "./StakingRewardsTabContent.module.css";

type StakingRewardsTabContentType = {
  blockchain: string;
  address: string;
  rewards: { reward_date: string; reward_amount: number }[];
};

export const StakingRewardsTabContent: React.FunctionComponent<
  StakingRewardsTabContentType
> = ({ ...props }) => {
  const { blockchain, address, rewards } = props;

  return (
    <>
      {rewards.length > 0 ? (
        <div className={styles.rewardsTabContentContainer}>
          <div className={styles.rewardsTabContentGraph}>
            <WalletGraph blockchain={blockchain} rewards={rewards} />
          </div>
          <div className={styles.rewardsTabContentDetails}>
            <StakingRewardDetails
              blockchain={blockchain}
              address={address}
              rewards={rewards}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
