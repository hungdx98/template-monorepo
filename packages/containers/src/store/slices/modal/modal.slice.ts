import { ModalQueueAction, ModalQueueState, ModalType } from './modal.slice.types';
import { createStore } from '../../../utils';
import compact from 'lodash/compact';

export const useModalQueue = createStore<ModalQueueState & ModalQueueAction>(
    (set, get) => ({
        queue: [],
        current: null,

        open: (modals: ModalType[]) => {
            const { current, queue } = get();

            // Filter out duplicates
            const uniqueModals = compact(modals).filter(
                (m) => m !== current && !queue.includes(m)
            );

            if (!current && uniqueModals.length > 0) {
                set({
                    current: uniqueModals[0],
                    queue: uniqueModals.slice(1),
                });
            } else if (uniqueModals.length > 0) {
                set({ queue: [...queue, ...uniqueModals] });
            }
        },

        close: () => {
            const { queue } = get();
            if (queue.length > 0) {
                const [next, ...rest] = queue;
                set({ current: next, queue: rest });
            } else {
                set({ current: null });
            }
        },

        reset: () => set({ current: null, queue: [] }),
    })
);