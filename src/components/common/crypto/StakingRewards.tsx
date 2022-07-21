import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { ReduxRootState } from "../../../redux/store"
import { Tabs } from "../../navigation/Tabs";
import { StakingRewardsTabContent } from "./StakingRewardsTabContent";

export const StakingRewards = ({ ...props }) => {
    const rewardAddresses = useSelector((state: ReduxRootState) => state.crypto.addressTracker.rewards);

    const [rewardAddressList, setRewardAddressList] = useState<string[]>([])

    const [activeTabAddress, setActiveTabAddress] = useState<string>('')
    const [tabReward, setTabReward] = useState<any>([])
    const [tabBlockchain, setTabBlockchain] = useState<string>('')

    useEffect(() => {
        const addrArray = Object.keys(rewardAddresses);
        try {
            setRewardAddressList(addrArray)
            if (addrArray.length > 0) {
                setTabReward(rewardAddresses[addrArray[0]].rewards)
                setTabBlockchain(rewardAddresses[addrArray[0]].blockchain)
                setActiveTabAddress(addrArray[0])
            } else {
                setTabReward([])
                setTabBlockchain('')
                setActiveTabAddress('')
            }
        } catch (err) {
            // reset on error
            setRewardAddressList([])
            setTabReward([])
            setTabBlockchain('')
            setActiveTabAddress('')
        }
    }, [rewardAddresses])

    const handleTabChange = (address: string) => {
        // console.log('staking rewards handle tab', address)
        setTabReward(rewardAddresses[address].rewards)
        setTabBlockchain(rewardAddresses[address].blockchain)
        setActiveTabAddress(address)
    }

    return (
        <>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Tabs tabs={rewardAddressList} handleTabChange={handleTabChange} />
                <StakingRewardsTabContent blockchain={tabBlockchain} address={activeTabAddress} rewards={tabReward} />
            </div>
        </>
    )
}