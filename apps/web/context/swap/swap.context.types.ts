import { Token } from "@repo/utils/types";
import { ChangeEvent } from "react";
import { Transaction } from 'web3';
import { EFeeTier } from "../createPosition";
export interface QuoteResponse {
    tokenIn: string; // Address of the input token
    tokenOut: string; // Address of the output token
    fee: string; // Fee tier (e.g., "3000")
    recipient: string; // Address of the recipient
    deadline: number; // Deadline as a Unix timestamp
    amountIn: string; // Input amount in wei
    amountOutMinimum: string; // Minimum output amount in wei
    sqrtPriceLimitX96: number; // Price limit (default is 0)
    amountOut: string; // Actual output amount in wei
    pool: string; // Address of the pool
    slippage: number; // Slippage percentage
    transaction: {
        from: string; // Sender's address
        to: string; // Contract address
        data: string; // Encoded transaction data
        approveAddress: string; // Address to approve
    };
}

export interface IStateSwapContext {
    state: {
        pairTokens: {
            token0?: Token;
            token1?: Token;
        },
        amountIn: string;
        amountOut: string;
        fiatIn: string;
        fiatOut: string;
        priceImpact: number;
        quote: QuoteResponse;
        isFetching: boolean;
        isLoadingTx: boolean;
        error?: any; // Error object or message
        isHigherPriceImpact: boolean;
        coinCurrent: Token[];
        feeTier: EFeeTier;
        slippage: string; // Slippage percentage as a string
        approveTx: Transaction | undefined
        isFetchGas: boolean;
        gas: {
            gasLimit: string;
            gasPrice: string;
        } | undefined;
    };
    jobs: {
        onSelectPairToken: (type: 'token0' | 'token1', token: Token) => void;
        onChangeAmountIn: (e: ChangeEvent<HTMLInputElement>) => void;
        handleExchange: (transaction: Transaction) => () => Promise<void>;
        onSelectFeeTier: (fee: EFeeTier) => () => void;
        onChangeSlippage: (e: ChangeEvent<HTMLInputElement>) => void;
    };
    ref: {

    };
}