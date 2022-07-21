//styling
import './DefaultButton.css'


type DefaultButtonProps = {
    content: string,
    onClick: any,
    disabled?: boolean
    width?: number
}

export const DefaultButton: React.FunctionComponent<DefaultButtonProps> = ({ ...props }) => {
    const { content, onClick, width, disabled } = props

    return (
        <button
            className={`defaultButton-style ${disabled ? 'defaultButton-style-disabled' : ''}`}
            style={{
                width: width ? width : 50,
                height: 30,
                marginLeft: 5,
            }}
            disabled={disabled}
            onClick={onClick}
        > {content}</button >
    )
}