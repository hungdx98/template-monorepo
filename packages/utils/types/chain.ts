import type { AdaptersConfig } from '@coin98-com/wallet-adapter-base';
import type { TokenInfo, Token as TokenCore, MarketInfo, Chain as ChainCore } from '@wallet/core';
import type { Transaction } from "web3";

interface Chain extends ChainCore { }
interface Token extends Omit<TokenCore, 'market' | 'prices' | 'decimal' | 'balance'> {
  rawBalance?: string; // Raw balance from API
  fiat?: string; // Fiat value of token
  balance?: string; // Formatted balance
  chainId?: string; // Chain ID of the token
  decimals: number;
  decimal?: number;
  current_price?: string;
  market?: {
    current_price: string;
  }
  marketInfo?: {
    current_price: string;
  }
  prices?: {
    price: number, // Price of current token in USD
    bitcoin: number, // Price in BTC
    ethereum: number, // Price in ETH
    total: string // Calculated Price: balance * priceInUSD
  }
}

export type { AdaptersConfig, Chain, TokenInfo, Token, Transaction, MarketInfo };
