// import { imageUrls } from 'hooks/useUser';
import { sample } from 'lodash';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

//default avatar
export const imageUrls = [
  '/images/avatarDefault/c98-default-dagora.png',
  '/images/avatarDefault/c98-default-dagora2.png',
  '/images/avatarDefault/c98-default-dagora3.png',
  '/images/avatarDefault/c98-default-dagora4.png',
  '/images/avatarDefault/c98-default-dagora5.png',
  '/images/avatarDefault/c98-default-dagora6.png',
  '/images/avatarDefault/c98-default-dagora7.png',
  '/images/avatarDefault/c98-default-dagora8.png',
  '/images/avatarDefault/c98-default-dagora9.png',
  '/images/avatarDefault/c98-default-dagora.png',
];

interface GlobalState {
  version: string;
  isGlobalMounted: boolean;
  setVersion: (version: string) => void;
  setIsGlobalMounted: (isGlobalMounted: boolean) => void;
 
}

const notPersistStates = ['isGlobalMounted', 'isShowCart'];

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        // Default state
        isGlobalMounted: false,
        version: '0.0.0',

        // Set state
        setVersion: (version) => set({ version }),
        setIsGlobalMounted: (isGlobalMounted) => set({ isGlobalMounted }),
      }),
      {
        name: 'global',
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) => !notPersistStates.includes(key),
            ),
          ),
      },
    ),
  ),
);
