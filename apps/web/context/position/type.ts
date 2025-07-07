import { Token } from "@repo/utils/types";

export enum EPositionStep {
    token_pair = 'token_pair',
    price_range = 'price_range'
}

export enum EFeeTier {
    // LOW = "0.01",
    STANDARD = "0.05",
    MEDIUM = "0.3",
    HIGH = "1.0"
}
export interface IStatePosition {
    step: EPositionStep;
}

export interface IPriceRange {
    min: string;
    max: string;
}

export interface IDepositAmount {
    base: string;
    pair: string;
}
export interface IStatePositionPairTokens {
    token0?: Token;
    token1?: Token;
}
export interface IStatePositionContext {
    state: IStatePosition & {
        feeTier: EFeeTier;
        step: EPositionStep;
        pairTokens: IStatePositionPairTokens;
        isContinue: boolean;
        priceRange: IPriceRange;
        isCreatedPool: boolean;
        initialRate: string;
        depositAmount: {
            base: string;
            pair: string;
        };
    };
    jobs: {
        onChangeStep: (step: EPositionStep) => void;
        onSelectPairToken: (type: 'token0' | 'token1', token: Token) => void;
        isPoolCreated: (fee: string) => Promise<boolean>;
        onSelectFeeTier: (fee: EFeeTier) => () => void;
        onChangePriceRange: (type: 'min' | 'max') => (e: React.ChangeEvent<HTMLInputElement>) => void;
        onChangeDepositAmount: (type: 'base' | 'pair') => (e: React.ChangeEvent<HTMLInputElement>) => void;
        setDepositAmount: (params:IDepositAmount) => void;
        setPriceRange: (params:IPriceRange) => void;
        setIsCreatedPool: (params:boolean) => void;
        setInitialRate: (params:string) => void;
        onCreatePool: () => Promise<string | any>;
        onAddPoolLiquidity: () => Promise<string | any>;

        setAllowanceAmount: (params: { base: string; pair: string }) => void;
        onCheckAllowance: (token: Token) => Promise<string>;
    };
}