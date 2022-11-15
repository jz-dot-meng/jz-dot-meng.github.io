//styling
import { useEffect, useState } from "react";
import { addEllipses } from "../../utils/wallet/string";
import styles from "./Tabs.module.css";

type TabsProps = {
  tabs: string[];
  handleTabChange: (address: string) => void;
};

export const Tabs: React.FunctionComponent<TabsProps> = ({ ...props }) => {
  const { tabs, handleTabChange } = props;

  const [addresses, setAddresses] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    setAddresses(tabs);
    setActiveTab(0);
  }, [tabs]);

  const setActive = (e: any, address: string) => {
    // console.log(e, address)
    const indexAsNum = parseInt(e.target.value);
    setActiveTab(indexAsNum);
    handleTabChange(address);
  };

  return (
    <>
      <div className={styles.tabsContainer}>
        {addresses.map((address, index) => (
          <button
            key={address}
            value={index}
            className={`${styles.tabItem} ${
              index === activeTab ? styles.activeTab : ""
            }`}
            onClick={(e) => setActive(e, address)}
          >
            {addEllipses(address)}
          </button>
        ))}
      </div>
    </>
  );
};
