
import DOMPurify from 'dompurify'

//styling
import './GameButton.css'

interface IDOMPurifyWindow extends Window {
    DOMPurify: typeof DOMPurify;
}

type GameButtonType = {
    buttonText: string,
    onClick: () => void
}

export const GameButton: React.FunctionComponent<GameButtonType> = ({ ...props }) => {
    // const window = new JSDOM('').window;
    // const DOMPurify = createDOMPurify(window);

    const purify =
        ((window as unknown) as IDOMPurifyWindow)?.DOMPurify || DOMPurify;



    const { buttonText, onClick } = props

    const sanitizeData = (text: string) => {
        return { __html: DOMPurify.sanitize(text) }
    }

    return (
        <button className="gameButton-style"
            onClick={onClick}
            // currently set by me, but find better way to sanitize and display
            dangerouslySetInnerHTML={sanitizeData(buttonText)}
        >
        </button>
    )
}