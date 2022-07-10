
type DefaultButtonProps = {
    content: string,
    onClick: any,
    width?: number
}

export const DefaultButton: React.FunctionComponent<DefaultButtonProps> = ({ ...props }) => {
    const { content, onClick, width } = props

    return (
        <button
            style={{
                border: 'none',
                borderRadius: '4px',
                width: width ? width : 50,
                height: 30,
                marginLeft: 5,
                color: 'white',
                backgroundColor: '#FF7F50',
                alignSelf: 'center',
                cursor: 'pointer'
            }}
            onClick={onClick}
        >{content}</button>
    )
}