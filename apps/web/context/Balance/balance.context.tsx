"use client"

import { BaseMarket } from "@/services/controllers";
import { useBaseStore, useTokensStore } from "@/stores";
import { useWallet } from "@coin98-com/wallet-adapter-react";
import { WHITELISTED_CHAINS_DATA, WHITELISTED_CHAINS_TYPE } from "@repo/utils/constants";
import { filterAndEnrichTokens } from "@repo/utils/helpers";
import type { Chain, Token } from '@repo/utils/types';
import { useQuery } from '@tanstack/react-query';
import size from 'lodash/size';
import React, { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { useShallow } from 'zustand/shallow';
import { IStateBalanceContext } from "./balance.context.types";

const BalanceContext = createContext<IStateBalanceContext>({} as IStateBalanceContext);

const BalanceProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const currentChain = WHITELISTED_CHAINS_DATA[0] as Chain;
    const supportedChains = WHITELISTED_CHAINS_DATA;

    const [baseService] = useBaseStore(useShallow(state => [
        state.baseService
    ]));

    const [coinsLocal, coinCurrent, updateCoinCurrent, updateCoinLocal] = useTokensStore(useShallow(state => [
        state.coinLocal,
        state.coinCurrent,
        state.updateCoinCurrent,
        state.updateCoinLocal,
    ]));

    const { address, connecting } = useWallet();

    // Helper function to fetch tokens for a specific chain
    const fetchChainTokens = async (chain: Chain): Promise<Token[]> => {
        try {
            if (!baseService || !address) return [];
            return await baseService.tokens({
                address,
                chain: chain.chain,
            }) as Token[];
        } catch (error) {
            console.error(`Error fetching tokens for chain ${chain.chain}:`, error);
            return [];
        }
    };

    // Helper function to fetch local coins data
    const fetchLocalCoins = async (): Promise<Record<string, Token[]>> => {
        try {
            const chainSupported = WHITELISTED_CHAINS_TYPE.join(',');
            const res = await BaseMarket.get(`api/tokens?chains=${encodeURIComponent(chainSupported)}`) as Record<string, Token[]>;
            return size(res) ? res : coinsLocal;
        } catch (error) {
            console.error("Error fetching local coins data:", error);
            return coinsLocal;
        }
    };
    console.log("coinCurrent", coinCurrent);
    const fetchTokensBalance = async () => {
        // Initialize an empty array to store synchronized wallet tokens
        let syncedWalletTokens: Token[] = [];

        // If no wallet address is available, update the current coin state with an empty array
        if (!address) {
            updateCoinCurrent(syncedWalletTokens);
        }

        // Initialize local coins state with the existing coinsLocal or fetch them if empty
        let coinsLocalState = coinsLocal;
        if (!size(coinsLocal)) {
            const coinsRes = await fetchLocalCoins();
            if (!!coinsRes && size(coinsRes)) {
                coinsLocalState = coinsRes;
                updateCoinLocal(coinsRes);
            }
        }

        try {
            // Retrieve local coins for the current chain or use an empty array if none exist
            const coinsLocalByChain = coinsLocalState[currentChain.chain as string] || [];

            // Create a set to manage pending promises for fetching tokens from multiple chains
            const pendingPromises = new Set<Promise<Token[]>>();

            if (address) {
                // For each supported chain, fetch tokens and add the promise to the pending set
                supportedChains.forEach((chain) => {
                    const promise = fetchChainTokens(chain).finally(() => pendingPromises.delete(promise));
                    pendingPromises.add(promise);
                });

                // Process promises incrementally using Promise.race to handle one chain at a time
                while (pendingPromises.size > 0) {
                    const chainPromises = await Promise.race(pendingPromises);

                    // Filter and enrich the fetched tokens
                    const formattedTokens = filterAndEnrichTokens(chainPromises);

                    // Add the formatted tokens to the synchronized wallet tokens array
                    syncedWalletTokens.push(...formattedTokens);

                    // If no current coins are set, update the state with the synchronized wallet tokens
                    if (!size(coinCurrent)) {
                        updateCoinCurrent([...syncedWalletTokens]);
                    }

                    // Remove the processed promise from the pending set
                    pendingPromises.delete(chainPromises as unknown as Promise<Token[]>);
                }

                // Update the current coin state with all synchronized wallet tokens
                updateCoinCurrent(syncedWalletTokens);
            }

            // Return true to indicate successful execution
            return true;
        } catch (error) {
            // Log any errors that occur during the process
            console.error("Error in fetchTokensBalance:", error);

            // Return false to indicate failure
            return false;
        }
    };

    const queryFn = useCallback(() => fetchTokensBalance(), [baseService, address, currentChain, coinCurrent, coinsLocal]);

    const { isFetching: isFetchingTokensBalance } = useQuery({
        queryKey: ['tokens-balance-list', { address }],
        queryFn,
        enabled: !!baseService && !connecting,
        refetchInterval: 20 * 1000,
    });

    return (
        <BalanceContext.Provider value={{
            state: {
                isFetchingTokensBalance,
            },
            jobs: {

            },
            ref: {}
        }}>
            {children}
        </BalanceContext.Provider>
    );
};

const useBalanceService = () => useContext(BalanceContext);

export { BalanceProvider, useBalanceService };
