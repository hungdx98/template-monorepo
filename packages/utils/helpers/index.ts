import { Token } from "../types";
import { IExplorerParams } from "../types";

export const reOrderTokens = (tokens: Token[]): Token[] => {
    return tokens.sort((a, b) => (!a.address ? -1 : !b.address ? 1 : 0));
};

export const generateCodeNumber = (number: number = 9) => {
    let text = ''
    const possible = '123456789'
    for (let i = 0; i < number; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

export const generateErrorMessage = (error: any) => {
    return JSON.stringify(error?.message || error || 'Something went wrong', null, 2).replace(/"/g, '')
}

export const initExplorerURL = (_options: IExplorerParams): string => {
    const { hash = '', type = 'transaction', baseUrl } = _options;
    // Open the chain scan
    let formatUrl: string = '';

    if (baseUrl) {
        formatUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        formatUrl = `${formatUrl}${type === 'transaction' ? 'tx' : 'account'
            }/${hash}`;
    }
    return formatUrl;
}

// helper to convert a digit to subscript
const toSubscriptDigit = (num: number) => {
    const subs: Record<string, string> = {
        "0": "₀",
        "1": "₁",
        "2": "₂",
        "3": "₃",
        "4": "₄",
        "5": "₅",
        "6": "₆",
        "7": "₇",
        "8": "₈",
        "9": "₉",
    };
    return num.toString().split("").map(d => subs[d] || d).join("");
};

// Render string like 0.0₂114
export const renderSubscriptDigit = (value: string): string => {
    const str = value; // e.g., "0.00011400"
    const [intPart, fracPart] = value.split(".");

    if (!fracPart || fracPart.length < 2) return str;

    const first = fracPart[0]; // always shown
    let zeroCount = 0;
    let restIndex = 1;

    // Count zeros after the first decimal digit
    for (let i = 1; i < fracPart.length; i++) {
        if (fracPart[i] === "0") {
            zeroCount++;
        } else {
            restIndex = i;
            break;
        }
    }

    if (zeroCount > 2) {
        const sub = toSubscriptDigit(zeroCount);
        const rest = fracPart.slice(restIndex);
        return `${intPart}.${first}${sub}${rest}`;
    }

    // Not enough zeros to subscript — return original
    return str;
}

// Function to shift the first object and update keys
export const shiftAndReindex = (obj: Record<string, any>) => {
    const entries = Object.entries(obj); // Convert object to array of key-value pairs
    if (entries.length === 0) return null; // Handle empty object

    const [shiftedKey, shiftedValue] = entries.shift()!; // Remove the first entry
    const updatedObj = Object.fromEntries(
        entries.map(([key, value], index) => [index, value]) // Reindex keys
    );
    return updatedObj; // Return the shifted key-value pair
};

export const truncate = (original: string, options?: {
    length?: number,
    separator?: string
}) => {

    const { length = 5, separator = "..." } = options || {}

    const strLength = original.length;

    if (original.includes('.')) return original

    if ((strLength - length) < length) {
        return original
    }

    const firstCountLetter = original.slice(0, length);
    const lastCountLetter = original.slice(strLength - length, strLength);

    return `${firstCountLetter}${typeof separator === "string" ? separator : '...'}${lastCountLetter}`
}