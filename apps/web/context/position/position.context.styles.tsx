export enum EPositionStep {
    token_pair = 'token_pair',
    price_range = 'price_range'
}
export interface IStatePosition {
    step: EPositionStep;
}

export interface IStatePositionContext {
    state: IStatePosition & {

    };
    jobs: {
        onChangeStep: (step: EPositionStep) => void;
    };
    ref: {

    };
}