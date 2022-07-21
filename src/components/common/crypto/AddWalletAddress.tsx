import { useState } from "react";
import { useDispatch } from "react-redux";
import { addWalletAddress } from "../../../redux/wallet/actions/addressActions";
import { validateAddress } from "../../../utils/wallet/validation";
import { ErrorDialog } from "../../dialog/ErrorDialog";
import { DefaultButton } from "../buttons/DefaultButton";


type AddWalletAddressProps = {
    blockchains: string[]
    toggleIsLoading: any;
}

export const AddWalletAddress: React.FunctionComponent<AddWalletAddressProps> = ({ ...props }) => {
    const { blockchains, toggleIsLoading } = props;

    const [selectedChain, setSelectedChain] = useState<string>(blockchains[0]);
    const [walletAddress, setWalletAddress] = useState<string>('')

    //error handling
    const [errorTitle, setErrorTitle] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);

    const dispatch = useDispatch()

    const selectOptionHandler = (event: Event | any) => {
        // console.log('select', event.target.value)
        setSelectedChain(event.target.value)
    }

    const inputHandler = (event: Event | any) => {
        // console.log('input', event.target.value)
        setWalletAddress(event.target.value)
    }

    const submitHandler = async () => {
        // console.log(selectedChain, walletAddress)
        toggleIsLoading(true)
        try {
            const isValid = await validateAddress(selectedChain, walletAddress)
            if (!isValid) {
                // throw error
                setErrorTitle('Error with address')
                setErrorMessage('Does not exist on the blockchain')
                setShowError(true);
                setWalletAddress('')
                toggleIsLoading(false)
                return;
            }
            // add to redux
            dispatch(addWalletAddress({ blockchain: selectedChain, address: walletAddress }))
            toggleIsLoading(false)
            setWalletAddress('')
        } catch (e: any) {
            // error with api somehow
            setErrorTitle('Error with API')
            setErrorMessage(e)
            setShowError(true);
            setWalletAddress('')
            toggleIsLoading(false)
        }
    }

    const errorCloseHandler = () => {
        setShowError(false)
    }

    return (
        <>
            <ErrorDialog open={showError} handleClose={errorCloseHandler} title={errorTitle} message={errorMessage} />
            <div style={{ display: "flex", width: "100%" }}>
                <select
                    style={{
                        border: '1px solid #d5d5d5',
                        borderRadius: 4,
                        width: '100px'
                    }}
                    onChange={selectOptionHandler}
                >
                    <option disabled>Select a supported blockchain</option>
                    {blockchains.map((chain, index) => (
                        <option value={chain} key={index}>{chain}</option>
                    ))}
                </select>
                <input
                    type={'text'}
                    style={{
                        flex: 1,
                        marginLeft: 5,
                        border: '1px solid #d5d5d5',
                        borderRadius: 4
                    }}
                    value={walletAddress}
                    onInput={inputHandler} />
                <DefaultButton
                    content=' + '
                    onClick={submitHandler} />
            </div>
        </>
    )
}