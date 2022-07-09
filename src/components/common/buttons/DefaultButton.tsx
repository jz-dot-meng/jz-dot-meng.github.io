
type DefaultButtonProps = {
    content: string,
    onClick: any
}

export const DefaultButton: React.FunctionComponent<DefaultButtonProps> = ({ ...props }) => {
    const { content, onClick } = props

    return (
        <button
            style={{
                border: 'none',
                borderRadius: '4px',
                width: 50,
                height: 30,
                marginLeft: 5,
                color: 'white',
                backgroundColor: '#FF7F50'
            }}
            onClick={onClick}
        >{content}</button>
    )
}