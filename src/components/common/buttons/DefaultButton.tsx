//styling
import styles from "./DefaultButton.module.css";

type DefaultButtonProps = {
  content: string;
  onClick: any;
  disabled?: boolean;
  width?: number;
};

export const DefaultButton: React.FunctionComponent<DefaultButtonProps> = ({
  ...props
}) => {
  const { content, onClick, width, disabled } = props;

  return (
    <button
      className={`${styles.defaultButtonStyle} ${
        disabled ? styles.defaultButtonStyleDisabled : ""
      }`}
      style={{
        width: width ? width : 50,
        height: 30,
        marginLeft: 5,
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {" "}
      {content}
    </button>
  );
};
