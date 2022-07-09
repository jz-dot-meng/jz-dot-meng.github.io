import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { ReduxRootState } from "../../../redux/wallet/store"
import { Tabs } from "../../navigation/Tabs";
import { StakingRewardsTabContent } from "./StakingRewardsTabContent";

export const StakingRewards = ({ ...props }) => {
    const rewardAddresses = useSelector((state: ReduxRootState) => state.crypto.addressTracker.rewards);

    const [rewardAddressList, setRewardAddressList] = useState<string[]>([])

    // const [activeTabAddress, setActiveTabAddress] = useState<string>('')
    const [tabReward, setTabReward] = useState<any>([])
    const [tabBlockchain, setTabBlockchain] = useState<string>('')

    useEffect(() => {
        const addrArray = Object.keys(rewardAddresses);
        // console.log(addrArray)
        try {
            setRewardAddressList(addrArray)
            if (addrArray.length > 0) {
                setTabReward(rewardAddresses[addrArray[0]].rewards)
                setTabBlockchain(rewardAddresses[addrArray[0]].blockchain)
            }
        } catch (err) {
            console.warn('rendering issues, trying to render a removed item')
            setRewardAddressList([])
            setTabReward([])
            setTabBlockchain('')
        }
        // setActiveTabAddress(addrArray[0])
    }, [rewardAddresses])

    const handleTabChange = (address: string) => {
        // console.log('staking rewards handle tab', address)
        setTabReward(rewardAddresses[address].rewards)
        setTabBlockchain(rewardAddresses[address].blockchain)
    }

    return (
        <>
            <Tabs tabs={rewardAddressList} handleTabChange={handleTabChange} />
            <StakingRewardsTabContent blockchain={tabBlockchain} rewards={tabReward} />
        </>
    )
}