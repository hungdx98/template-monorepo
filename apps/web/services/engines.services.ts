"use client";
import { WHITELISTED_CHAINS_DATA, WHITELISTED_CHAINS_TYPE } from "@repo/utils/constants";
import { EngineConfiguration, MarketInfo, TokenInfo } from "@wallet/core";
import { BaseWallet } from "@wallet/base";
import { EvmEngine } from "@wallet/evm";
import { BaseAdapter, BaseAPI } from "./controllers";

interface IConstructor {
    coinGeckoList: MarketInfo[];
    coinLocalList: Record<string, TokenInfo[]>;
}

export class EnginesService {
    coinGeckoList: MarketInfo[];
    coinLocalList: Record<string, TokenInfo[]>;

    constructor({ coinGeckoList, coinLocalList }: IConstructor) {
        this.coinGeckoList = coinGeckoList;
        this.coinLocalList = coinLocalList;
    }

    public getEngineConfig = (): EngineConfiguration | undefined => {
        try {
            const customNetworks = WHITELISTED_CHAINS_DATA.reduce((networks, current, index) => {
                const networkKey = WHITELISTED_CHAINS_TYPE[index];
                if (networkKey) {
                    //@ts-ignore
                    networks[networkKey] = { [networkKey]: current };
                }
                return networks;
            }, { evm: {}, cosmos: {} });

            return {
                network: this.getRpcConfig(),
                tokenInfos: this.getTokenInfos(),
                marketInfos: this.coinGeckoList,
                //@ts-ignore
                provider: this.getProvider(),
                enableLogger: true,
                //@ts-ignore
                service: {},
                configs: {},
                //@ts-ignore
                nftInfos: {},
                custom: {
                    networks: customNetworks,
                },
            };
        } catch (e) {
            console.log("Error:", e);
            return undefined;
        }
    }

    public getRpcConfig = (): Record<string, string> => {
        return WHITELISTED_CHAINS_DATA.reduce((chainInfo, current) => {
            let { chain, rpcURL } = current;
            return {
                ...chainInfo,
                [chain!]: rpcURL,
            };
        }, {});
    }

    public getProvider = () => {
        return {
            api: BaseAPI,
            adapter: BaseAdapter,
        }
    };

    public getTokenInfos = (): Record<string, TokenInfo[]> => {
        const tokenInfos: Record<string, TokenInfo[]> = {};
        WHITELISTED_CHAINS_TYPE.forEach(chain => {
            tokenInfos[chain as string] = this.coinLocalList[chain as string] as TokenInfo[];
        });
        return tokenInfos;
    };

    public initializeBaseService = (): BaseWallet | null => {
        try {
            const engineConfig = this.getEngineConfig();
            const baseWallet = new BaseWallet(engineConfig as EngineConfiguration<any>, [
                // @ts-ignore
                EvmEngine
            ]);
            return baseWallet;
        } catch (error) {
            console.log("error", error);
            return null;
        }
    }
}

