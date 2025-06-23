import { viction, type ChainInfo } from '@coin98-com/wallet-adapter-base';
import { SUPPORTED_BLOCKCHAINS } from '@coin98-com/wallet-adapter-react';
import { CHAIN_DATA, CHAIN_TYPE } from '@wallet/constants';
import { type Chain } from '../types';

export const CHAINS_SUPPORTED_ADAPTER = [SUPPORTED_BLOCKCHAINS.ethereum];

export const DEFAULT_CHAINS: ChainInfo[] = [viction];

export const WHITELISTED_CHAINS_DATA: Chain[] = [CHAIN_DATA[CHAIN_TYPE.tomo]];

export const WHITELISTED_CHAINS_TYPE = WHITELISTED_CHAINS_DATA.map((c) => c.chain);
export { CHAIN_DATA, CHAIN_TYPE };