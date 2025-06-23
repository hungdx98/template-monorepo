export enum ModalType {
    CONFIRM = 'confirm',
    // APPROVE = 'approve',
    SETTING = 'setting',
    HISTORY = 'history',
    HIGH_PRICE_IMPACT = 'high_price_impact',
    HIGH_SLIPPAGE_TOLERANCE = 'high_slippage_tolerance',
}

export interface ModalQueueState {
    queue: ModalType[];
    current: ModalType | null;
};

export interface ModalQueueAction {
    open: (modals: ModalType[]) => void;
    close: () => void;
    reset: () => void;
}