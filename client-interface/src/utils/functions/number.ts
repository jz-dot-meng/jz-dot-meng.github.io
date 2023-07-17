export const sciNumToString = (float: number, maxDecimals?: number) => {
    const floatString = float.toString();
    if (floatString.includes("e")) {
        // detect scientific notation
        const [digits, exp] = floatString.split("e");
        const replaced = digits.replace(".", "").replace("-", "");
        const expNum = Number(exp);
        const zeroPadding = "0".repeat(Math.abs(expNum) - 1); // minus 1 for decimal point in the sci notation
        const sign = float < 0 ? "-" : "";
        if (expNum > 0) return `${sign}${replaced}${zeroPadding}.0`;
        else
            return `${sign}0.${
                maxDecimals
                    ? (zeroPadding + replaced).slice(0, maxDecimals)
                    : `${zeroPadding}${replaced}`
            }`;
    }
    const [whole, decimals] = floatString.split(".");
    if (!decimals) return whole;
    return `${whole}.${maxDecimals ? decimals.slice(0, maxDecimals) : decimals}`;
};
