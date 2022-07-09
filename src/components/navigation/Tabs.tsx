
//styling
import { useEffect, useState } from 'react';
import { addEllipses } from '../../utils/wallet/string';
import './Tabs.css'

type TabsProps = {
    tabs: string[];
    handleTabChange: (address: string) => void;
}

export const Tabs: React.FunctionComponent<TabsProps> = ({ ...props }) => {
    const { tabs, handleTabChange } = props;

    const [addresses, setAddresses] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<number>(0)


    useEffect(() => {
        setAddresses(tabs)
        setActiveTab(0)
    }, [tabs])

    const setActive = (e: any, address: string) => {
        // console.log(e, address)
        const indexAsNum = parseInt(e.target.value)
        setActiveTab(indexAsNum)
        handleTabChange(address)
    }

    return (
        <>
            <div className="tabs-container">
                {addresses.map((address, index) => (
                    <button
                        key={address}
                        value={index}
                        className={`tab-item ${index === activeTab ? 'active-tab' : ''}`}
                        onClick={(e) => setActive(e, address)}>
                        {addEllipses(address)}
                    </button>
                ))}
            </div>
        </>
    )
}