import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { CryptoAddressPayload, removeWalletAddress } from "../../../redux/wallet/actions/addressActions";
import { ReduxRootState } from "../../../redux/wallet/store"
import { addEllipses } from "../../../utils/wallet/string";
import { DefaultButton } from "../buttons/DefaultButton";

//styling
import './DisplayAddresses.css'

type DisplayAddressesProps = {
    isLoading: boolean
}

export const DisplayAddresses: React.FunctionComponent<DisplayAddressesProps> = ({ ...props }) => {
    const { isLoading } = props
    const addresses = useSelector((state: ReduxRootState) => state.crypto.addressTracker.addresses);

    const [addressList, setAddressList] = useState<CryptoAddressPayload[]>([])


    useEffect(() => {
        // call render
        setAddressList(addresses)
    }, [addresses])

    const dispatch = useDispatch()

    const removeAddress = (address: CryptoAddressPayload) => {
        dispatch(removeWalletAddress(address))
    }

    return (
        <>
            <div className="displayAddress-container">
                {isLoading ?
                    <div className="displayAddress-loadingState">
                        <div className="displayAddress-spinner"></div>
                    </div>
                    :
                    <></>
                }
                <table className="displayAddress-table">
                    <thead>
                        <tr>
                            <th>Chain</th>
                            <th>Address</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            addressList.map((address) => (
                                <tr key={address.address}>
                                    <td>{address.blockchain}</td>
                                    <td>{addEllipses(address.address)}</td>
                                    <td>
                                        <DefaultButton
                                            content=' - '
                                            onClick={() => removeAddress(address)}
                                        />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

            </div>
        </>
    )
}