import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReduxRootState } from "../../../redux/store";
import {
  CryptoAddressPayload,
  removeWalletAddress,
} from "../../../redux/wallet/actions/addressActions";
import { addEllipses } from "../../../utils/wallet/string";
import { DefaultButton } from "../buttons/DefaultButton";

//styling
import styles from "./DisplayAddresses.module.css";

type DisplayAddressesProps = {
  isLoading: boolean;
};

export const DisplayAddresses: React.FunctionComponent<
  DisplayAddressesProps
> = ({ ...props }) => {
  const { isLoading } = props;
  const addresses = useSelector(
    (state: ReduxRootState) => state.crypto.addressTracker.addresses
  );

  const [addressList, setAddressList] = useState<CryptoAddressPayload[]>([]);

  useEffect(() => {
    // call render
    setAddressList(addresses);
  }, [addresses]);

  const dispatch = useDispatch();

  const removeAddress = (address: CryptoAddressPayload) => {
    dispatch(removeWalletAddress(address));
  };

  return (
    <div
      style={{
        width: "100%",
        margin: "1em 0",
        position: "relative",
      }}
    >
      <table
        style={{
          width: "100%",
        }}
      >
        <thead>
          <tr>
            <th>Chain</th>
            <th>Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {addressList.map((address) => (
            <tr
              key={address.address}
              style={{ textAlign: "center", height: "2.5em" }}
            >
              <td>{address.blockchain}</td>
              <td>{addEllipses(address.address)}</td>
              <td>
                <DefaultButton
                  content=" - "
                  onClick={() => removeAddress(address)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoading && (
        <div className={styles.displayAddressLoadingState}>
          <div className={styles.displayAddressSpinner}></div>
        </div>
      )}
    </div>
  );
};
