import { viction, type ChainInfo } from '@coin98-com/wallet-adapter-base';
import { SUPPORTED_BLOCKCHAINS } from '@coin98-com/wallet-adapter-react';
import { type Chain } from '../types';

const CHAIN_DATA = {
    tomo: {
        path: 889,

        numChainId: 88,
        chainId: '0x58',

        order: 2,
        isToken: true,
        standard: 'VRC25',
        nftStandard: 'VRC721',
        isSupportedNFT: true,
        isCrawlNFTServices: true,
        isDataField: true,
        // nftMint: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',

        isWeb3: true,
        isFee: true,
        icon: 'app_viction',
        balanceContract: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
        multiTransferContract: '0x3c39f41b6d7ee19F8e3aC4Df886f595736029b20',
        // multiTransferContract: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',

        id: 'tomochain',
        name: 'Viction',
        shortName: 'Vic',
        logo: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/Tomo.png',
        symbol: 'VIC',
        chain: 'tomo',
        tokenStandard: 'VIC VRC25',
        rpcURL: 'https://rpc.tomochain.com',
        scan: 'https://www.vicscan.xyz',
    }
}

export const CHAINS_SUPPORTED_ADAPTER = [SUPPORTED_BLOCKCHAINS.ethereum];

export const DEFAULT_CHAINS: ChainInfo[] = [viction];

export const WHITELISTED_CHAINS_DATA: Chain[] = [CHAIN_DATA.tomo as Chain];

export const WHITELISTED_CHAINS_TYPE = WHITELISTED_CHAINS_DATA.map((c) => c.chain);
export { CHAIN_DATA };