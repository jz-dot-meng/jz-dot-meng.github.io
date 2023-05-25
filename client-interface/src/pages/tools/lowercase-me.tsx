import { ToolWrapper } from "@components/tools/ToolWrapper";
import { BaseSyntheticEvent, useState } from "react";
import { toast } from "react-toastify";

const LowercaseMe: React.FunctionComponent = () => {
    const [value, setValue] = useState<string>("");
    const handleInput = (e: BaseSyntheticEvent) => {
        const text = e.target.value;
        setValue(text);
        if (text !== "") {
            navigator.clipboard.writeText(text.toLowerCase());
            console.log(text.toLowerCase());
            toast.info(`${text.toLowerCase()} copied to clipboard`);
        }
    };
    return (
        <ToolWrapper title="lowercase me" secondaryTitle="for all your hex needs">
            <div>
                <div className="flex flex-col flex-1 gap-1">
                    <p>paste in any text here:</p>
                    <input
                        type={"text"}
                        onClick={(e) => e.stopPropagation()}
                        className={`form-control w-full h-[42px] text-white cursor-text placeholder-grey-300 flex-1 bg-grey-800 rounded-md text-xs px-3 py-3 caret-coral-400 focus:ring-transparent border-grey-400 hover:border-coral-300 focus:border-coral-400 focus:ring-coral-400`}
                        value={value}
                        onInput={handleInput}
                    />
                </div>
            </div>
        </ToolWrapper>
    );
};

export default LowercaseMe;
