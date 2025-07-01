import { createStore, createStoreWithPersisted } from '../utils';
import {
  ITokenManagerAction,
  ITokenManagerState,
  ITokensAction,
  ITokensState
} from './tokens.slice.types';

import _get from 'lodash/get';

import { findTokenByAttributes } from '@repo/utils/helpers';
import type { MarketInfo, Token } from '@repo/utils/types';

const defaultState = {
  coinGecko: [],
  coinLocal: {},
  coinCurrent: [],
};

const defaultStateTokenSelected = {
  tokensSelected: [] as [Token?, Token?],
  customTokens: {},
  recentPairs: {} as Record<string, [Token, Token]>,
  recentTokens: {} as Record<string, Token[]>,
};

export const useTokensStore = createStore<ITokensState & ITokensAction>(
  (set: (partial: Partial<ITokensState>) => void, get) => ({
    ...defaultState,
    updateCoinLocal: (coinLocal: Record<string, Token[]>) =>
      set({ coinLocal }),
    updateCoinGekco: (coinGecko: MarketInfo[]) => set({ coinGecko }),
    updateCoinCurrent: (coinCurrent: Token[]) => set({ coinCurrent }),
  }),
);

export const useTokenManagerStore = createStoreWithPersisted<
  ITokenManagerState & ITokenManagerAction
>(
  (set: (partial: Partial<ITokenManagerState>) => void, get: () => ITokenManagerState & ITokenManagerAction) => ({
    ...defaultStateTokenSelected,
    updateSelectedTokenMarketInfo: (_tokens: Token | Token[]) => {
      const { tokensSelected } = get();
      // Normalize _tokens to always be an array
      const tokensArray = Array.isArray(_tokens) ? _tokens : [_tokens];

      const tokensFormat = tokensSelected.map((item: Token | undefined) => {
        if (!item) return;

        // Check if the current item matches any token in the tokensArray
        const matchingToken = findTokenByAttributes(item, tokensArray);

        if (matchingToken) {
          return {
            ...item,
            market: {
              ...item.market,
              ..._get(matchingToken, 'market', _get(matchingToken, 'marketInfo')),
            },
          };
        }

        return item; // Return the original item if no match is found
      });

      set({ tokensSelected: tokensFormat as [Token?, Token?] });
    },
  }),
  { name: 'token-manager' },
);
