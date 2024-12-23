export type RadioOption = {
    display: string;
    value: string;
};

type RadioProps = {
    options: RadioOption[];
    selected: string;
    select: (value: string) => void;
};
export const Radio: React.FunctionComponent<RadioProps> = ({ ...props }) => {
    const { options, selected, select } = props;

    return (
        <div className="flex gap-2 items-center rounded-md">
            {options.map((option) => (
                <button
                    key={option.value}
                    className={selected === option.value ? "text-coral-400" : ""}
                    onClick={() => select(option.value)}
                >
                    {option.display}
                </button>
            ))}
        </div>
    );
};
