import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addEtfToPortfolio, removeEtfFromPortfolio, subtractFromRemainingPortfolioWeight } from "../../../redux/equities/actions/etfOverlapActions"
import { ReduxRootState } from "../../../redux/store"
import { fetchHoldings } from "../../../utils/equities/etfholdings"
import { ErrorDialog } from "../../dialog/ErrorDialog"
import { DefaultButton } from "../buttons/DefaultButton"

//styling
import './AddEtfs.css'

type AddEtfsProps = {
    etfs: {
        [fundName: string]: { [ticker: string]: string }
    };
    toggleIsLoading: any
}

export const AddEtfs: React.FunctionComponent<AddEtfsProps> = ({ ...props }) => {
    const { etfs, toggleIsLoading } = props

    const remainingPortfolioWeight = useSelector((state: ReduxRootState) => state.equities.etfOverlap.remainingPortfolioWeight)

    const dispatch = useDispatch();

    // error handling
    const [errorTitle, setErrorTitle] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);

    const [selectedEtf, setSelectedEtf] = useState<string>('');
    const [selectedWeighting, setSelectedWeighting] = useState<number>(0)

    useEffect(() => {
        setSelectedEtf(Object.keys(etfs.betashares)[0])
    }, [])

    const selectOptionHandler = (event: Event | any) => {
        setSelectedEtf(event.target.value)
    }

    const inputHandler = (event: Event | any) => {
        // validation
        let weighting = Number(event.target.value)
        if (weighting > Number(remainingPortfolioWeight)) {
            weighting = Number(remainingPortfolioWeight)
        }
        setSelectedWeighting(weighting)
    }

    const submitHandler = async () => {
        if (selectedWeighting == undefined) {
            return
        }
        toggleIsLoading(true)
        try {
            dispatch(subtractFromRemainingPortfolioWeight(selectedWeighting))
            dispatch(addEtfToPortfolio({ [selectedEtf]: selectedWeighting }));
            const data = await fetchHoldings(selectedEtf)
            if (data == undefined) {
                throw Error('Something went wrong...')
            }
            toggleIsLoading(false)
            setSelectedWeighting(0)
        } catch (err: any) {
            dispatch(removeEtfFromPortfolio(selectedEtf))
            setErrorTitle('Error with API')
            setErrorMessage(err)
            setShowError(true);
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
                    <option disabled>Betashares</option>
                    {Object.keys(etfs.betashares).map((etf, index) => (
                        <option value={etf} key={index}>{etf}: {etfs.betashares[etf]}</option>
                    ))}
                </select>
                <span className="addetfs-inputcontainer"
                ><input
                        type={'number'}
                        className='addetfs-numberinput'
                        max={100}
                        value={selectedWeighting}
                        onInput={inputHandler} />
                </span>
                <DefaultButton
                    content=' + '
                    onClick={submitHandler}
                    disabled={selectedWeighting === 0}
                />
            </div>
        </>
    )
}