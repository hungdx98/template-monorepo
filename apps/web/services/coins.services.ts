import axios from "axios";
import { AxiosCacheInstance, setupCache } from "axios-cache-interceptor";
import type { Token, MarketInfo } from "@wallet/core";
import { CHAIN_TYPE } from "@wallet/constants";

const DEFAULT_TIMEOUT = 120000;
const SOURCE = "C98SUPAGEIR";

export const WHITELISTED_CHAINS_TYPE = [CHAIN_TYPE.tomo];

export class CoinsService {
    public async getCoinLocal<R extends Record<string, Token[]>>(): Promise<R | undefined> {
        try {
            const chainSupported = WHITELISTED_CHAINS_TYPE.join(',');
            const coinLocal = await this.baseMarket.get<R>(`api/tokens?chains=${encodeURIComponent(chainSupported)}`, {
                cache: { ttl: 60 * 5 * 1000 }, //✅ Cache for 5 minutes
            });
            return coinLocal.data;
        } catch (error) {
            console.error("Error get coin local:", error);
            return;
        }
    }

    public async getCoinGecko<R extends MarketInfo[]>(): Promise<R | undefined> {
        try {
            const coinGecko = await this.baseMarket.get<R>("api/token-prices", {
                cache: { ttl: 60 * 1000 }, //✅ Cache for 1 minutes
            });
            return coinGecko.data
        } catch (error) {
            console.error("Error get coin local", error);
            return;
        }
    }

    public getHeadersAPI = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Version: "1",
        Authorization: "Bearer token",
        Signature: process.env.NEXT_PUBLIC_SIGNATURE,
        Source: SOURCE,
    }

    public baseMarket: AxiosCacheInstance = setupCache(axios.create({
        baseURL: 'https://superwallet-markets.coin98.tech/',
        timeout: DEFAULT_TIMEOUT,
        headers: this.getHeadersAPI
    }));
} ``