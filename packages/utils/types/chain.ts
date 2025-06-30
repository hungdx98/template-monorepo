import type { AdaptersConfig } from '@coin98-com/wallet-adapter-base';
import type { Transaction } from "web3";

interface Chain {
  chainId?: string
  numChainId?: number // Hard to rename
  chain?: string
  path?: number // path index, for eg: `44/num/num/num
  // Flags
  isHardware?: boolean // True: ledger | trezor
  isToken?: boolean // True: has token
  isSupportedNFT?: boolean // Refactor naming later
  isSupportedV2?: boolean
  isSystem?: boolean
  isDataField?: boolean,
  isMnemonicOnly?: boolean
  isWeb3?: boolean
  isCustom?: boolean
  isFee?: boolean //! Need to refactor
  isSupportedEIP1559?: boolean //! Need to refactor
  isL2?: boolean // Layer 2 | EVM only
  isLibrary?: boolean
  isExcluded?: boolean
  // Meta Info
  order?: number
  id?: string // Coingecko ID
  name: string
  shortName?: string
  subName?: string // For eg: Avax-C | Avax-P
  standard?: string // Refactor from: trcToken
  tokenStandard?: string // Refactor from: trcName
  nftStandard?: string // Refactor from: nftToken
  balanceContract?: string // Refactor from: balances
  multiTransferContract?: string | boolean // Refactor from: multisend
  icon: string // Refactor from: image
  logo?: string // Refactor from: imageLink
  symbol?: string
  replacementSymbol?: string // Implement for special case like BSC
  prefix?: string // Bech32 Prefix
  defaultFee?: string | number // Merge from feeDefault & defaultGas
  // Temp using for old compatible
  isCosmos?: boolean
  isFactory?: boolean
  isMemo?: boolean
  environment?: string // TODO: Replace soon
  gasMultiple?: number
  // Default Node
  rpcURL?: string
  scan?: string
  scanTxPrefix?: string
  scanAddressPrefix?: string
  scanBlockPrefix?: string
  // crawl service option
  isCrawlServices?: boolean
  isCrawlNFTServices?: boolean
  // for testnet, devnet
  symbolSuffix?: string
  nameSuffix?: string,
  // tmp solutions for buff gas
  rapidNetwork?: boolean
  // prefix gas name
  gasUnit?: string
  // oracle
  gasOracleAddress?: string
  // gas unit decimal
  gasDecimal?: number
}

interface TokenInfo {
  address: string
  chain: string
  decimal: number
  decimals?: number
  image: string
  name: string
  symbol: string
  // Cosmos Only
  minimalSymbol?: string
  cgkId: string
  // optional advance
  isNFT?: boolean
}

interface MarketInfo {
  id: string
  current_price: string,
  market_cap: string,
  total_volume: string,
  price_change_percentage_24h: string,
  circulating_supply: string,
  total_supply: string
}

export interface TokenCore {
  id: string // Generated Id From Information
  name: string
  symbol: string
  chain: string
  decimal: number
  balance: string,
  rawBalance?: string,
  image: string,
  prices: {
    price: number, // Price of current token in USD
    bitcoin: number, // Price in BTC
    ethereum: number, // Price in ETH
    total: string // Calculated Price: balance * priceInUSD
  },
  market: {
    cgkId: string
    volume: number
    market_cap: number
    circulating_supply: number
    max_supply: number
    price_change_percentage_24h: number
  },
  // Refactor later:
  address?: string // Token address, leave as blank if it's maincoin
  walletAddress?: string // Wallet address of token
  baseAddress?: string // Share variable for Solana, Ethermint (EVM + COSMOS) & Other chain with sub address;
  tokenType?: string // Ex: TRC10, TRC20, ERC20,... optional
  isCosmos?: boolean
  isOldVersion?: boolean // For type token 2022 only Solana
}
interface Token extends Omit<TokenCore, 'market' | 'prices' | 'decimal' | 'balance'> {
  rawBalance?: string; // Raw balance from API
  fiat?: string; // Fiat value of token
  balance?: string; // Formatted balance
  chainId?: string; // Chain ID of the token
  decimals: number;
  decimal?: number;
  current_price?: string;
  market?: {
    current_price: string;
  }
  marketInfo?: {
    current_price: string;
  }
  prices?: {
    price: number, // Price of current token in USD
    bitcoin: number, // Price in BTC
    ethereum: number, // Price in ETH
    total: string // Calculated Price: balance * priceInUSD
  }
}

export type { AdaptersConfig, Chain, MarketInfo, Token, TokenInfo, Transaction };

