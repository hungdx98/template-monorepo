import { type Chain } from '@superlink/utils/types';

export interface ILiquiditySource {
    name: string;
    icon: string;
}

export interface State {
    theme: ThemeMode;
    locale: LocaleType;
    currentChain: Chain;
    supportedChains: Chain[];
    slippage: string | undefined;
    isCustomSlippage: boolean | undefined;
    inactiveLiqSources: Set<ILiquiditySource>;
    liqSourcesByChain: Record<string, ILiquiditySource[]>;
}

export interface Action {
    onChangeTheme: (theme?: ThemeMode) => void;
    onChangeLocale: (locale: LocaleType) => void;
    onChangeCurrentChain: (chain: Chain) => void;
    onChangeSlippage: (slippage: string) => void;
    onChangeCustomSlippage: (isCustomSlippage: boolean) => void;
    onChangeInactiveLiqSources: (liquiditySources: Set<ILiquiditySource>) => void;
    onChangeLiqSourcesByChain: (liqSourcesByChain: Record<string, string[]>) => void;
}

export enum ThemeMode {
    Dark = 'dark',
    Light = 'light',
}

export enum LocaleType {
    Eng = 'en',
    Vn = 'vi',
}

export type ThemeConfig = { [key: string]: string | number };