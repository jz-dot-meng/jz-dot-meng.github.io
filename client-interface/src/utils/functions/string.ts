type PrettifiedSuccessResult = {
    success: true;
    data: string[];
};
type PrettifiedErrorResult = {
    success: false;
    error: string;
};
export type PrettifiedResult = PrettifiedSuccessResult | PrettifiedErrorResult;

export const debugRustPrettify = (text: string): PrettifiedResult => {
    if (!text) {
        return {
            success: false as const,
            error: "Input text is empty",
        };
    }

    try {
        // Basic validation - check if the input looks like a Rust debug output
        if (!isValidRustDebugFormat(text)) {
            return {
                success: false as const,
                error: "Input does not appear to be a valid Rust debug output",
            };
        }

        // Parse and format the input
        const formattedLines = formatRustDebug(text);

        return {
            success: true as const,
            data: formattedLines,
        };
    } catch (error) {
        return {
            success: false as const,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
};

/**
 * Checks if the input string appears to be a valid Rust debug output
 */
const isValidRustDebugFormat = (text: string): boolean => {
    // Very basic validation - check if it has balanced braces and looks like a struct or enum
    const structPattern = /^\w+(::\w+)*\s*\{.*\}$/;
    const enumPattern = /^\w+(::\w+)*\s*\(.*\)$/;

    if (!structPattern.test(text) && !enumPattern.test(text)) {
        return false;
    }

    // Check for balanced braces
    return hasBalancedBraces(text);
};

/**
 * Checks if the input string has balanced braces
 */
const hasBalancedBraces = (text: string): boolean => {
    const stack: string[] = [];

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === "{" || char === "(" || char === "[") {
            stack.push(char);
        } else if (char === "}" || char === ")" || char === "]") {
            const last = stack.pop();

            if (
                (char === "}" && last !== "{") ||
                (char === ")" && last !== "(") ||
                (char === "]" && last !== "[")
            ) {
                return false;
            }
        }
    }

    return stack.length === 0;
};

/**
 * Formats a Rust debug output string with proper indentation
 */
const formatRustDebug = (text: string): string[] => {
    // For simple enum variants with values, just return as is
    if (/^\w+(::\w+)*\s*\([^{]*\)$/.test(text)) {
        return [text.trim()];
    }

    const result: string[] = [];
    let currentIndent = 0;
    let currentLine = "";
    let inString = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // Handle string literals
        if (char === '"' && (i === 0 || text[i - 1] !== "\\")) {
            inString = !inString;
            currentLine += char;
            continue;
        }

        if (inString) {
            currentLine += char;
            continue;
        }

        switch (char) {
            case "{":
                // Push the line before the brace (struct name)
                result.push(" ".repeat(currentIndent) + currentLine.trim() + " {");
                currentIndent += 4;
                currentLine = ""; // Reset for content inside
                break;

            case "}":
                {
                    // Push the last field line inside the struct (if any)
                    if (currentLine.trim()) {
                        result.push(" ".repeat(currentIndent) + currentLine.trim());
                    }
                    currentIndent = Math.max(0, currentIndent - 4);

                    // Check if the next non-whitespace character is a comma
                    let nextCharIndex = i + 1;
                    while (nextCharIndex < text.length && text[nextCharIndex] === " ") {
                        nextCharIndex++;
                    }

                    let closingLine = " ".repeat(currentIndent) + "}";
                    if (nextCharIndex < text.length && text[nextCharIndex] === ",") {
                        closingLine += ",";
                        i = nextCharIndex; // Skip the comma as we've handled it
                    }

                    result.push(closingLine);
                    currentLine = ""; // Reset
                }
                break;

            case ",":
                // Push the completed field line with a comma
                result.push(" ".repeat(currentIndent) + currentLine.trim() + ",");
                currentLine = ""; // Reset for the next field
                break;

            case ":":
                currentLine += ": ";
                // Skip the space after colon
                if (i + 1 < text.length && text[i + 1] === " ") {
                    i++;
                }
                break;

            default:
                // Append non-space characters, or spaces only if not the first char of the line content
                if (char !== " " || currentLine.length > 0) {
                    currentLine += char;
                }
                break;
        }
    }

    // Add any remaining part (should be rare with this logic)
    if (currentLine.trim()) {
        result.push(" ".repeat(currentIndent) + currentLine.trim());
    }

    // Filter out potential empty lines just in case
    return result.filter((line) => line.trim().length > 0);
};



export const debugTsPrettify = (text: string): PrettifiedResult => {
    if (!text) {
        return {
            success: false as const,
            error: "Input text is empty",
        };
    }

    try {
        // Attempt to parse the input string as JSON
        const parsedObject = JSON.parse(text);

        // Re-stringify the object with indentation (4 spaces)
        const prettifiedJson = JSON.stringify(parsedObject, null, 4);

        // Split into lines
        const formattedLines = prettifiedJson.split('\n');

        return {
            success: true as const,
            data: formattedLines,
        };
    } catch (error) {
        let errorMessage = "Unknown error occurred";
        if (error instanceof SyntaxError) {
            errorMessage = `Invalid JSON: ${error.message}`;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        return {
            success: false as const,
            error: errorMessage,
        };
    }
};

/**
 * Attempts to strip // and /* ... * / comments from a JSON-like string.
 * IMPORTANT: This is a best-effort approach using regex and may fail on complex edge cases,
 * especially with comments inside strings or escaped characters.
 * It does NOT handle trailing commas or unquoted keys.
 */
export const stripJsonComments = (jsonString: string): string => {
    // Remove block comments /* ... */ (non-greedy to handle nested ones poorly but avoid over-matching)
    // Replace with empty string
    let stripped = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');

    // Remove line comments // ... (match until end of line)
    // Replace with empty string
    stripped = stripped.replace(/\/\/.*$/gm, '');

    stripped = stripped.replace(/ /g, '')
    stripped = stripped.replace(/\n/g, '') // Use global flag to remove all newlines

    // Optional: Attempt to remove trailing commas (might be risky)
    // stripped = stripped.replace(/,\s*([}\]])/g, '$1');

    // Note: This doesn't handle comments inside strings correctly.
    // A more robust solution would require a proper parser state machine.
    return stripped;
};
