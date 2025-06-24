import { Token } from '@/types/Token'

export type SwapContextType = {
  tokenIn: Token | null
  tokenOut: Token | null
  amountIn: string
  slippage: number
  setTokenIn: (t: Token) => void
  setTokenOut: (t: Token) => void
  setAmountIn: (val: string) => void
  setSlippage: (val: number) => void
}

export interface TokenSelectorModalProps {
  selected?: Token
  onSelect?: (token: Token) => void
  tokens?: Token[]
  hideTab?: boolean
  hideSearch?: boolean
  page?: string
}

export type { Token }
