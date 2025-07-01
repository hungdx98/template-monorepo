export enum EPositionStep {
    token_pair = 'token_pair',
    price_range = 'price_range'
}
export interface IStatePosition {
    step: EPositionStep;
}

export interface IStatePositionPairTokens {
    token0?: any; // Replace 'any' with the actual type of token A
    token1?: any; // Replace 'any' with the actual type of token B
}



export interface IStatePositionContext {
    state: IStatePosition & {
        step: EPositionStep;
        pairTokens: IStatePositionPairTokens;
        
    };
    jobs: {
        onChangeStep: (step: EPositionStep) => void;
        onSelectPairToken: (type: 'token0' | 'token1', token:any) => void;
    };
    ref: {

    };
}