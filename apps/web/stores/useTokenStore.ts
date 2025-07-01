import { create } from 'zustand'
import { listTokens } from './constants'

type TokenStore = {
  tokens: any[]
  
}

export const useTokenStore = create<TokenStore>((set) => ({
  tokens: listTokens,
}))