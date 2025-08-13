import { GameButton } from "@components/common/buttons/GameButton";
import { ToolWrapper } from "@components/tools/ToolWrapper";
import { debugTsPrettify, type PrettifiedResult } from "@utils/functions/string";
import { isValidVersionedTransaction, mapVersionedTransaction } from "@utils/functions/transaction/solana";
import type {
    MappedTransaction as MappedTransactionType,
    VersionedTransaction as VersionedTransactionType,
} from "@utils/types/solana";
import { type BaseSyntheticEvent, type JSX, useMemo, useState } from "react";
import { toast } from "react-toastify";

const VersionedTxnMapper: React.FunctionComponent = () => {
    const [errored, setErrored] = useState<boolean>(false);
    const [unvalidatedText, setUnvalidatedText] = useState<string>();
    const [mappedTxn, setMappedTxn] = useState<MappedTransactionType>();
    const [prettifiedText, setPrettifiedText] = useState<string[]>();
    const [collapsedLines, setCollapsedLines] = useState<Record<number, boolean>>({});

    const handleTextInput = (e: BaseSyntheticEvent) => {
        const text = e.target.value;
        setUnvalidatedText(text);
    };

    const copy = () => {
        navigator.clipboard.writeText(JSON.stringify(mappedTxn));
        toast.info(`Mapped transaction copied to clipboard`);
    };

    const convert = () => {
        try {
            if (!unvalidatedText) {
                const errorMsg = "Input text is empty";
                setPrettifiedText([errorMsg]);
                setErrored(true);
                toast.error(errorMsg);
                return;
            }

            const parsed = JSON.parse(unvalidatedText);

            // Use the utility function for validation
            const validation = isValidVersionedTransaction(parsed);
            if (!validation.isValid) {
                const errorMessages = [
                    "Input is not a valid versioned transaction:",
                    ...validation.errors
                ];
                setPrettifiedText(errorMessages);
                setErrored(true);
                toast.error("Invalid versioned transaction format");
                return;
            }

            // Cast to proper type after validation
            const validTxn = parsed as VersionedTransactionType;
            const mapped = mapVersionedTransaction(validTxn);
            setMappedTxn(mapped);

            const prettified: PrettifiedResult = debugTsPrettify(JSON.stringify(mapped));
            if (prettified.success) {
                setPrettifiedText(prettified.data);
                setErrored(false);
                setCollapsedLines({}); // Reset collapse state on new input
                toast.success("Transaction mapped successfully!");
            } else if (prettified.success === false) {
                const errorMsg = prettified.error;
                setPrettifiedText([errorMsg]);
                setErrored(true);
                toast.error(`Prettification failed: ${errorMsg}`);
            }
        } catch (err) {
            console.error("Error parsing or mapping transaction:", err);
            let errorMessage = "An unexpected error occurred processing the transaction.";
            if (err instanceof SyntaxError) {
                errorMessage = `Invalid JSON input: ${err.message}. Please ensure the input is strictly valid JSON.`;
            } else if (err instanceof Error) {
                errorMessage = `Error: ${err.message}`;
            }
            setPrettifiedText([errorMessage]);
            setErrored(true);
            toast.error(errorMessage);
        }
    };

    return (
        <ToolWrapper title="versioned txn mapper" secondaryTitle="map account indexes to static keys in versioned transactions">
            <div className="flex flex-col gap-4">
                <div className="flex flex-1 gap-2 flex-col max-h-96 md:flex-row">
                    <div className="flex flex-1 flex-col gap-1">
                        <textarea
                            rows={10}
                            onInput={handleTextInput}
                            placeholder="Paste your versioned transaction JSON here..."
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
                                                // biome-ignore lint/suspicious/noArrayIndexKey: not looking to optimise here
                                                key={index}
                                                className={`flex text-xs ${
                                                    errored ? "text-red-400" : "text-grey-400"
                                                }`}
                                            >
                                                <span className="w-10 text-right pr-2 select-none flex items-center">
                                                    {isBlockStart && endLine !== undefined ? (
                                                        <button
                                                            type="button"
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
                <div className="flex gap-2">
                    <GameButton onClick={convert} buttonText={"Map Transaction"} />
                    <GameButton onClick={copy} disabled={!mappedTxn} buttonText={"Copy"} />
                </div>
            </div>
        </ToolWrapper>
    );
};

export default VersionedTxnMapper;
