import { IExplorerParams, Token } from "../types";
import _get from 'lodash/get';
import _toLower from 'lodash/toLower';
import _compact from 'lodash/compact';
import { convertWeiToBalance, formatNumberBro } from '@wallet/utils'

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

/**
 * Finds a token in the provided token list that matches the attributes of the target token.
 *
 * The function compares the `address`, `chain`, and `symbol` attributes of the target token
 * with each token in the token list. Additionally, it checks if the `cgkId` or `market.cgkId`
 * attributes match.
 *
 * @param targetToken - The token object to find a match for.
 * @param tokenList - A list of tokens to search through.
 * @returns The matching token if found, otherwise `undefined`.
 */
export const findTokenByAttributes = (targetToken: Token, tokenList: Token[]): Token | undefined => {
    // Define the keys to compare between the target token and tokens in the list.
    const keysToCompare = ['address', 'chain', 'symbol'];

    // Find a token in the list that matches the target token based on the defined keys and `cgkId`.
    const matchingToken = tokenList.find((currentToken) =>
        // Check if all keys match (case-insensitive comparison).
        keysToCompare.every(key =>
            _toLower(_get(targetToken, key)) === _toLower(_get(currentToken, key)))
    );

    // Return the matching token, or `undefined` if no match is found.
    return matchingToken;
}

/**
 * Filters and enriches a list of tokens by removing invalid entries and adding calculated properties.
 *
 * This function performs the following steps:
 * 1. Filters out tokens with:
 *    - A name or symbol of 'Unknown'.
 *    - No valid current price in the `market`, `marketInfo`, or `info` fields.
 * 2. Enriches the remaining tokens by:
 *    - Calculating the `decimals` value from the `decimals` or `decimal` field.
 *    - Extracting the `rawBalance` as a string.
 *    - Calculating the `totalPrice` by converting the `rawBalance` to a human-readable balance
 *      and multiplying it by the `current_price`.
 *    - Formatting the `totalPrice` into a fiat string with 4 decimal places.
 *    - Merging additional information from the `info` field into the token object.
 *
 * @param tokens - An array of `Token` objects to filter and enrich.
 * @returns An array of enriched `Token` objects with additional calculated properties.
 */
export const filterAndEnrichTokens = (tokens: Token[]): Token[] => {
    // Filter out tokens with 'Unknown' name and symbol or without a valid current price
    const filteredTokens = tokens.filter((coin) => {
        const hasValidPrice = _get(coin, 'market.current_price') ||
            _get(coin, 'marketInfo.current_price') ||
            _get(coin, 'info.current_price');
        return coin.name !== 'Unknown' && coin.symbol !== 'Unknown' && !!hasValidPrice;
    });

    // Map and format the filtered tokens
    return _compact(filteredTokens).map((coin: Token) => {
        const decimals = Number(_get(coin, 'decimals', _get(coin, 'decimal', 0)));
        const rawBalance = String(_get(coin, 'rawBalance', '0'));
        const marketPrice = Number(_get(coin.market, 'current_price', '0'));
        const totalPrice = Number(convertWeiToBalance(rawBalance, decimals)) * marketPrice;

        return {
            ...coin,
            ..._get(coin, 'info', {}), // Merge additional info
            decimals,
            rawBalance,
            fiat: String(formatNumberBro(totalPrice, 4)), // Format fiat value
        };
    });
};