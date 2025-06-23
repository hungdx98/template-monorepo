export enum DEFAULT_DECIMALS_TOKEN {
    fiat = 2,
    token = 4
}

export interface IExplorerParams {
    hash: string;
    type?: 'transaction' | 'address' | 'block' | 'link';
    baseUrl?: string;
}