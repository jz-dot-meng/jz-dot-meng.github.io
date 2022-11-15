import DOMPurify from "dompurify";

//styling
import styles from "./GameButton.module.css";

type GameButtonType = {
  buttonText: string;
  onClick: () => void;
};

export const GameButton: React.FunctionComponent<GameButtonType> = ({
  ...props
}) => {
  const { buttonText, onClick } = props;

  const sanitizeData = (text: string) => {
    return { __html: DOMPurify.sanitize(text) };
  };

  return (
    <button
      className={styles.gameButtonStyle}
      onClick={onClick}
      // currently set by me, but find better way to sanitize and display
      dangerouslySetInnerHTML={sanitizeData(buttonText)}
    ></button>
  );
};
