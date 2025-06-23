import { WALLETS_NAME } from '@coin98-com/wallet-adapter-base';
import { Coin98WalletAdapter } from '@coin98-com/wallet-adapter-coin98';
import { MetaMaskWalletAdapter } from '@coin98-com/wallet-adapter-metamask';

const WALLETS_SUPPORTED = [Coin98WalletAdapter, MetaMaskWalletAdapter];

export { WALLETS_NAME, WALLETS_SUPPORTED };