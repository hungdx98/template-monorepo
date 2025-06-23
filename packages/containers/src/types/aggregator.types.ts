import { IQuoteRequestParams } from "@superlink/utils/types";
import { Cell } from "@ton/core";
export interface IQuoteParams {
    chainId: string;
    token0: IToken
    token1: IToken
    amount: string;
    slippage?: string;
    gasPrice?: string;
    wallet: string;
    backer?: EBacker[],
    isAuto?: boolean;
}

export interface ISwapParams {
    id: string;
    amount: string;
    chainId: string;
    slippage: string;
    tokenIn: IToken;
    tokenOut: IToken;
    wallet: string;
    backer: EBacker;
}


export interface ISwapRequestParams extends IQuoteRequestParams {
    slippage: string,
    quote: IQuoteResponse
}

export interface ISwapResponse {
    fromToken: string;
    toToken: string;
    fromTokenAmount: string;
    toTokenAmount: string;
    tx: ISwapTx;
    approveTarget?: string | null;
    /**
     * @Note Only for Ton network and Solana
     */
    messages?: IMessage[] | string[]
}

export interface IMessage {
    address: string,
    amount: string | bigint,
    payload?: string,
    stateInit?: Cell
}

export interface ISwapTx {
    from: string;
    to: string;
    data: string | null | any;
    value: string;
}
export interface IQuoteResponse extends IAdditionalData {
    id: EBacker;
    isV2: boolean;
    name: EBacker;
    logo: string;
    amount: number;
    additionalData: IAdditionalData;
    autoSlippage: number;
    address: string;
    isBest?: boolean;
}

export interface IAdditionalData {
    chainId: string;
    fromToken: IToken | string;
    fromTokenAmount: string;
    toToken: IToken | string;
    toTokenAmount: string;
    address: string;
    aggregator: string;
    protocolFee: IFee;
    partnerFee: IFee;
    routes?: IRoutes[];
}
export interface IRoutes {
    percent: number;
    route: IRoute;
    quote: string;
}

export interface IRoute {
    path: IToken[];
    pools: IPool[];
}
export interface IPool {
    exchange: string;
    pool: string;
    percent: number
}
export interface IFee {
    amount: string;
    percent: number;
}

export type IToken = {
    address?: string;
    chainId?: string;
    name?: string;
    symbol: string;
    decimals: number;
    isNative?: boolean;
    nativeAddress?: string;
};

export interface IBacker {
    name: EBacker;
    logo?: string;
}

export enum EBacker {
    // _1inch = "1inch",
    // _Ocean = "OpenOcean",
    _0x = "0x",
    _OKX = "OKX",
    _Firebird = "FireBird",
    _ParaSwap = "ParaSwap",
    _KyberSwap = "KyberSwap",
    _Hashflow = "Hashflow",
    _Dodo = "Dodo",
    _Jupiter = "Jupiter",
    _Arken = "Arken",
    _LiFi = "LiFi",
    _StormLink = "StormLink",
}

