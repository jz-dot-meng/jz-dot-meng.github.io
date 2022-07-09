import { DefaultButton } from "../common/buttons/DefaultButton";

type ErrorDialogType = {
    title: string;
    message: string;
    open: boolean;
    handleClose: any;
}

export const ErrorDialog: React.FunctionComponent<ErrorDialogType> = ({ ...props }) => {
    const { title, message, open, handleClose } = props
    return (
        <>
            <div style={{
                display: open ? 'block' : 'none',
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 100,
                background: 'white',
                border: '1px solid rgb(213, 213, 213)',
                borderRadius: '4px',
                textAlign: 'center',
                maxWidth: '50%',
                padding: '1em'
            }}>
                <h4>{title} :: <span style={{ fontWeight: 'normal' }}>{message}</span></h4>
                <DefaultButton content='Ok' onClick={handleClose}></DefaultButton>
            </div>
        </>
    )
}