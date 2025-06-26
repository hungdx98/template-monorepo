
import { createStore } from '../../../utils';
import { PoolAction, PoolState } from './pool.types';

const defaultStates = {
    poolAddress: ''
}

export const usePoolStore = createStore<PoolState & PoolAction>(
    (set, get) => ({
        ...defaultStates,
        setPoolAddress: (address: string) => set({ poolAddress: address }),
    })
);