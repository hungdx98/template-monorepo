import { create } from 'zustand'

type PoolState = {
  poolAddress: string
  setPoolAddress: (srcAvatar: string) => void;
}

export const usePoolStore = create<PoolState>((set) => ({
  setPoolAddress: (address: string) => set({ poolAddress: address }),
  poolAddress: '',
}))