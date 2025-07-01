"use client";
import { AuthenticationService } from "@/services/authentication.services";
import { EnginesService } from "@/services/engines.services";
import { useBaseStore, useTokensStore } from "@/stores";
import { WHITELISTED_CHAINS_DATA } from "@repo/utils/constants";
import { MarketInfo, Token } from "@repo/utils/types";
import { TokenInfo } from "@wallet/core";
import _size from "lodash/size";
import { Fragment, FunctionComponent, useEffect, useRef } from "react";
import { useShallow } from 'zustand/shallow';

interface IProps {
  coinGecko?: MarketInfo[];
  coinLocal?: Record<string, Token[]>;
}

const InitializeService: FunctionComponent<IProps> = <P extends IProps>(props: P) => {
  const loaded = useRef(false);
  const currentChain = WHITELISTED_CHAINS_DATA[0]

  const [updateBaseService] = useBaseStore(useShallow((state) => [state.updateBaseService]));

  const updateCoinLocal = useTokensStore(useShallow((state) => state.updateCoinLocal));

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    (async () => {
      try {
        const { coinGecko, coinLocal } = props;

        if (!coinLocal || !_size(coinLocal)) throw new Error("CoinLocal is not initialized");

        updateCoinLocal(coinLocal);

        await AuthenticationService.initializeAuthentication();

        const engine = new EnginesService({ coinGeckoList: coinGecko as MarketInfo[], coinLocalList: coinLocal as unknown as Record<string, TokenInfo[]> });
        const base = engine.initializeBaseService();

        if (!base) throw new Error('Base service is not initialized');

        updateBaseService(base);
      } catch (error) {
        console.error('Error updating service:', error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, currentChain]);

  return <Fragment />;
};
export default InitializeService;