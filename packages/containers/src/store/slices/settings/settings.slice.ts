import { WHITELISTED_CHAINS_DATA } from '@superlink/utils/constants';
import { Chain } from "@superlink/utils/types";
import _get from 'lodash/get';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Action, ILiquiditySource, LocaleType, State, ThemeMode } from "./settings.slice.types";

const defaultState = {
  theme: ThemeMode.Light,
  locale: LocaleType.Eng,
  currentChain: WHITELISTED_CHAINS_DATA[0],
  supportedChains: WHITELISTED_CHAINS_DATA,
  slippage: undefined,
  isCustomSlippage: false,
  inactiveLiqSources: new Set<ILiquiditySource>(),
  liqSourcesByChain: {} as Record<string, ILiquiditySource[]>,
}

export const useSettingsStore = create<State & Action>()(
  persist(
    (set, get) => ({
      ...defaultState,
      reset: () => set({ ...defaultState }),
      onChangeTheme: (theme?: ThemeMode) => {
        const currentTheme = get().theme;
        if (theme) return set({ theme });
        const newTheme = currentTheme === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light
        set({ theme: newTheme });
      },
      onChangeSlippage: (slippage: string) => {
        if (Number(slippage) > 100) return;
        if (slippage === 'auto') return set({ slippage: undefined });
        if (slippage === get().slippage) return;
        set({ slippage });
      },
      onChangeCustomSlippage: (isCustomSlippage: boolean) => {
        set({ isCustomSlippage });
      },
      onChangeLocale: (locale: LocaleType) => { set({ locale }) },
      onChangeCurrentChain: (currentChain: Chain) => {
        if (get().currentChain.chainId !== currentChain.chainId) {
          set({ currentChain })
        }
      },
      onChangeLiqSourcesByChain: (liqSourcesByChain: Record<string, string[]>) => {
        const transformed: Record<string, ILiquiditySource[]> = {};

        for (const chainId in liqSourcesByChain) {
          if (chainId === 'icons') continue; // skip the icon map itself

          transformed[chainId] = liqSourcesByChain[chainId].map((dexName: string) => ({
            name: dexName,
            icon: _get(liqSourcesByChain, `icons.${dexName}`, '') as string, // fallback if icon is missing
          }));
        }
        set({ liqSourcesByChain: transformed });
      },
      onChangeInactiveLiqSources: (liquiditySources: Set<ILiquiditySource>) => {
        const currentSources = get().inactiveLiqSources;
        const updatedSources = new Set(currentSources);

        liquiditySources.forEach((liquiditySource) => {
          if (!updatedSources.has(liquiditySource)) {
            updatedSources.add(liquiditySource)
          }
        });

        set({ inactiveLiqSources: updatedSources });
      }
    }),
    {
      name: 'settings',
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(
          ([key]) => !['inactiveLiqSources', 'liqSourcesByChain'].includes(key)
        )
      ),
    }
  )
);
