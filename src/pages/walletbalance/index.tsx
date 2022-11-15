import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WalletPieChart } from "../../components/chart/crypto/WalletPieChart";
import { DefaultButton } from "../../components/common/buttons/DefaultButton";
import { AddWalletAddress } from "../../components/common/crypto/AddWalletAddress";
import { DisplayAddresses } from "../../components/common/crypto/DisplayAddresses";
import { StakingRewards } from "../../components/common/crypto/StakingRewards";
import { demoAddresses } from "../../constants";
import { ReduxRootState, store } from "../../redux/store";
import {
  addWalletAddress,
  removeWalletAddress,
} from "../../redux/wallet/actions/addressActions";
import { validateAddress } from "../../utils/wallet/validation";
//styling
import Link from "next/link";
import styles from "../../styles/Financial.module.css";

const WalletBalance: React.FunctionComponent = () => {
  const fiatBalanceArr = useSelector(
    (state: ReduxRootState) => state.crypto.addressTracker.balances.fiat
  );
  const currency = useSelector(
    (state: ReduxRootState) => state.crypto.currencyCoversion.currency
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalFiatBalance, setTotalFiatBalance] = useState<number>(0);

  const dispatch = useDispatch();

  useEffect(() => {
    let sum: number = 0;
    const blockchainArrayOfArrays = Object.values(fiatBalanceArr);
    // FIXME: not intuitive
    blockchainArrayOfArrays.forEach((chain) => {
      chain.forEach((address) => {
        const tokensPerAddr = Object.values(address);
        tokensPerAddr.forEach((tokens) => {
          tokens.forEach((token) => {
            const fiatVal = Object.values(token)[0];
            if (fiatVal) {
              sum += fiatVal;
            }
          });
        });
      });
    });
    setTotalFiatBalance(sum);
  }, [fiatBalanceArr]);

  const chains = [
    // 'Ethereum',
    "Polkadot",
    "Tezos",
    "Algorand",
    "Stellar",
  ];

  const toggleIsLoading = (state: boolean) => {
    setIsLoading(state);
  };

  const handleDemo = async () => {
    const state = store.getState();
    const addresses = state.crypto.addressTracker.addresses;
    if (addresses.length > 0) {
      addresses.forEach((address) => {
        store.dispatch(removeWalletAddress(address));
      });
    }
    const chains = Object.keys(demoAddresses);
    const demoAddrs = Object.values(demoAddresses);
    toggleIsLoading(true);
    for (let i = 0; i < chains.length; i++) {
      const randInd = Math.floor(Math.random() * 4.99);
      const address = demoAddrs[i][randInd];
      dispatch(addWalletAddress({ blockchain: chains[i], address: address }));
      await validateAddress(chains[i], address);
    }
    toggleIsLoading(false);
  };

  return (
    <>
      <div className={styles.balanceHeader}>
        <h4>
          <Link href="/">@jz-dot-meng</Link>
        </h4>
        <h1>
          wallet balance<span> :: a one-stop shop for various blockchains</span>
        </h1>
      </div>
      <div className={styles.balanceBody}>
        <div className={styles.balanceBodyUpper}>
          <section className={styles.upperLeft}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <h4 style={{ flex: 1 }}>Wallet Addresses</h4>
              <DefaultButton
                content="Demo random"
                onClick={handleDemo}
                width={100}
              />
            </div>
            <AddWalletAddress
              blockchains={chains}
              toggleIsLoading={toggleIsLoading}
            />
            <DisplayAddresses isLoading={isLoading} />
          </section>
          <section className={styles.upperRight}>
            <h4>
              Total Balance{" "}
              {totalFiatBalance > 0
                ? `:: ${Intl.NumberFormat("en-AU", {
                    style: "currency",
                    currency: currency,
                  }).format(totalFiatBalance)}`
                : ""}
            </h4>
            <div>
              <WalletPieChart />
            </div>
          </section>
        </div>
        <div className={styles.balanceBodyLower}>
          <section>
            <h4>Staking rewards</h4>
            <StakingRewards />
          </section>
        </div>
      </div>
    </>
  );
};

export default WalletBalance;
