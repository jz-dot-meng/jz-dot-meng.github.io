import React from "react";

type GameButtonType = {
    buttonText: string;
    disabled?: boolean;
    onClick: () => void;
    bgColor?: string;
};

export const GameButton: React.FunctionComponent<GameButtonType> = ({ ...props }) => {
    const { buttonText, onClick, disabled = false, bgColor = "bg-grey-600" } = props;

    return (
        <button
            className={`flex-1 p-1 rounded-md ${
                disabled ? "bg-grey-800/20 text-grey-600" : "cursor-pointer text-white " + bgColor
            } `}
            disabled={disabled}
            onClick={onClick}
        >
            {buttonText}
        </button>
    );
};
