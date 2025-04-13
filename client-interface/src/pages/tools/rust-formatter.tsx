import { GameButton } from "@components/common/buttons/GameButton";
import { ToolWrapper } from "@components/tools/ToolWrapper";
import { debugRustPrettify } from "@utils/functions/string";
import { BaseSyntheticEvent, JSX, useMemo, useState } from "react";

const DateFormatter: React.FunctionComponent = () => {
    const [errored, setErrored] = useState<boolean>(false);
    const [unvalidatedText, setUnvalidatedText] = useState<string>();
    const [prettifiedText, setPrettifiedText] = useState<string[]>();
    const [collapsedLines, setCollapsedLines] = useState<Record<number, boolean>>({});

    const handleTextInput = (e: BaseSyntheticEvent) => {
        const text = e.target.value;
        setUnvalidatedText(text);
    };

    const prettify = () => {
        const prettified = debugRustPrettify(unvalidatedText);
        if (prettified.success) {
            setPrettifiedText(prettified.data);
            setCollapsedLines({}); // Reset collapse state on new input
            setErrored(false);
        } else if (prettified.success === false) {
            setPrettifiedText([prettified.error]);
            setErrored(true);
        }
    };

    return (
        <ToolWrapper title="rust formatter" secondaryTitle="format rust debug logs">
            <div className="flex flex-col gap-4">
                <div className="flex flex-1 gap-2 flex-col max-h-96 md:flex-row">
                    <div className="flex flex-1 flex-col gap-1">
                        <textarea
                            rows={10}
                            onInput={handleTextInput}
                            className={`form-control w-full resize-none text-white cursor-text placeholder-grey-300 flex-1 bg-grey-800 rounded-md text-xs px-3 py-3 caret-coral-400 focus:ring-transparent border-grey-400 hover:border-coral-300 focus:border-coral-400 focus:ring-coral-400 no-scrollbar`}
                        ></textarea>
                    </div>
                    <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                        <div className="flex flex-1 gap-1 bg-grey-800 rounded-md p-3 overflow-hidden">
                            <div className="flex flex-1 flex-col overflow-scroll no-scrollbar">
                                {useMemo(() => {
                                    if (!prettifiedText) return null;

                                    const linesToRender: JSX.Element[] = [];
                                    const blockEndLines: Record<number, number> = {};
                                    const stack: number[] = [];

                                    // First pass: find block start/end lines
                                    prettifiedText.forEach((line, index) => {
                                        if (line.trimEnd().endsWith("{")) {
                                            stack.push(index);
                                        } else if (line.trim().startsWith("}")) {
                                            if (stack.length > 0) {
                                                const startLine = stack.pop();
                                                if (startLine !== undefined) {
                                                    blockEndLines[startLine] = index;
                                                }
                                            }
                                        }
                                    });

                                    let skipUntilLine: number | null = null;

                                    prettifiedText.forEach((line, index) => {
                                        if (skipUntilLine !== null && index <= skipUntilLine) {
                                            if (index === skipUntilLine) {
                                                skipUntilLine = null; // End skipping
                                            }
                                            return; // Skip rendering this line
                                        }

                                        const isBlockStart = line.trimEnd().endsWith("{");
                                        const isCollapsed = collapsedLines[index];
                                        const endLine = blockEndLines[index];

                                        const handleToggleCollapse = () => {
                                            setCollapsedLines((prev) => ({
                                                ...prev,
                                                [index]: !prev[index],
                                            }));
                                        };

                                        if (isBlockStart && isCollapsed && endLine !== undefined) {
                                            skipUntilLine = endLine; // Start skipping until the end line
                                        }

                                        linesToRender.push(
                                            <div
                                                key={index}
                                                className={`flex text-xs ${
                                                    errored ? "text-red-400" : "text-grey-400"
                                                }`}
                                            >
                                                <span className="w-10 text-right pr-2 select-none flex items-center">
                                                    {isBlockStart && endLine !== undefined ? (
                                                        <button
                                                            onClick={handleToggleCollapse}
                                                            className="mr-1 text-[6px] hover:text-white focus:outline-none"
                                                        >
                                                            {isCollapsed ? "▶" : "▼"}
                                                        </button>
                                                    ) : (
                                                        <span className="w-[0.9em]"></span> // Placeholder for alignment
                                                    )}
                                                    {index + 1}
                                                </span>
                                                <span className="flex-1 whitespace-pre font-mono">
                                                    {line}
                                                    {isBlockStart &&
                                                        isCollapsed &&
                                                        endLine !== undefined && (
                                                            <span className="text-grey-500 text-xs">
                                                                {" "}
                                                                ...{" "}
                                                            </span>
                                                        )}
                                                </span>
                                            </div>
                                        );
                                    });

                                    return linesToRender;
                                }, [prettifiedText, collapsedLines, errored])}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <GameButton onClick={prettify} buttonText={"Prettify"} />
                </div>
            </div>
        </ToolWrapper>
    );
};
export default DateFormatter;
