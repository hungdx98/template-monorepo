"use server";
import { MarketInfo, Token } from "@repo/utils/types";
import { CoinsService } from "../coins.services";

export const getCoinsService = async (): Promise<{
    coinGecko: MarketInfo[] | undefined;
    coinLocal: Record<string, Token[]> | undefined;
}> => {
    const coinsService = new CoinsService();
    const coinGecko = await coinsService.getCoinGecko();
    const coinLocal = await coinsService.getCoinLocal() as unknown as Record<string, Token[]>;
    return { coinGecko, coinLocal };
}