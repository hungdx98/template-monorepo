export interface ITokenResponse {
    symbol: string;
    name: string;
    decimals: number;
    address: string;
}
export interface IPools {
    tokenId: string;
    token0: ITokenResponse;
    token1: ITokenResponse;
    fee: string;
    pool: string;
    blockNumber: string;
};

export interface ITopPools {
    pools: IPools[];
    count: number;
}