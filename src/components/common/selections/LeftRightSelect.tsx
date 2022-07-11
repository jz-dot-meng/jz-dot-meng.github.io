import { useEffect, useState } from "react"

type LeftRightSelectProps = {
    options: string[],
    selection: number
    onChange: (newSelection: number) => void
}

export const LeftRightSelect: React.FunctionComponent<LeftRightSelectProps> = ({ ...props }) => {
    const { options, selection, onChange } = props

    const [currentSelection, setCurrentSelection] = useState<number>(0)

    useEffect(() => {
        setCurrentSelection(selection)
        console.log('initialise', currentSelection)
    }, [])

    const leftSelect = () => {
        // console.log('prior to setting', currentSelection)
        let newSelection: number;
        if (currentSelection === 0) {
            newSelection = options.length - 1
            setCurrentSelection(newSelection)
        } else {
            newSelection = currentSelection - 1
            setCurrentSelection(newSelection)
        }
        onChange(newSelection)
    }

    const rightSelect = () => {
        // console.log('prior to setting', currentSelection)
        let newSelection: number;
        if (currentSelection === options.length - 1) {
            newSelection = 0;
            setCurrentSelection(newSelection)
        } else {
            newSelection = currentSelection + 1
            setCurrentSelection(newSelection)
        }
        onChange(newSelection)
    }

    return (
        <>
            <div style={{
                color: 'rgb(140,140,140)',
                width: '100%',
                display: 'flex',
                padding: '0.5em 0',
                borderRadius: '0.5em',
                backgroundColor: 'rgba(255,255,255,0.8)',
                justifyContent: 'center'
            }}>
                <div
                    style={{
                        margin: '0 1em',
                        cursor: 'pointer'
                    }}
                    onClick={leftSelect}
                >
                    &lsaquo;
                </div>
                <div style={{
                    width: '150px',
                    textAlign: 'center'
                }}>
                    {options[currentSelection]}
                </div>
                <div
                    style={{
                        margin: '0 1em',
                        cursor: 'pointer'
                    }} onClick={rightSelect}
                >
                    &rsaquo;
                </div>
            </div>
        </>
    )
}