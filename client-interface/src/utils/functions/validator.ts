import { type Chain } from "data-cache";

export const parseChainMode = (chainMode: string): Chain => {
    switch (chainMode) {
        case "evm":
            return "evm";
        case "svm":
            return "svm";
        default:
            throw new Error("Invalid chain mode");
    }
};
