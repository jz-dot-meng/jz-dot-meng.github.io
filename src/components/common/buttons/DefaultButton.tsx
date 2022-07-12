//styling
import './DefaultButton.css'


type DefaultButtonProps = {
    content: string,
    onClick: any,
    width?: number
}

export const DefaultButton: React.FunctionComponent<DefaultButtonProps> = ({ ...props }) => {
    const { content, onClick, width } = props

    return (
        <button
            className='defaultButton-style'
            style={{
                width: width ? width : 50,
                height: 30,
                marginLeft: 5,
            }}
            onClick={onClick}
        > {content}</button >
    )
}