import { MarketInfo, Token } from '@repo/utils/types';

export interface ITokensState {
  coinLocal: Record<string, Token[]>;
  coinGecko: MarketInfo[];
  coinCurrent: Token[];
}

export enum ESelectingToken {
  First = 'first',
  Second = 'second',
}

export interface ITokensAction {
  updateCoinLocal: (coinLocal: Record<string, Token[]>) => void;
  updateCoinGekco: (coinGecko: MarketInfo[]) => void;
  updateCoinCurrent: (coinCurrent: Token[]) => void;
}

export interface ITokenManagerState {
  customTokens: Record<string, Token[]>;
  tokensSelected: [Token?, Token?];
  recentPairs: Record<string, [Token, Token]>;
  recentTokens: Record<string, Token[]>;
}

export interface ITokenManagerAction {
  // updateSelectedTokenMarketInfo: (_tokens: Token | Token[]) => void;
  // updateSelectedTokenBalance: (_tokens: Token | Token[]) => void;
}