import get from 'lodash/get'

import { mapResolutionToTimeFormat } from './helpers'
import { Token } from '@/types/Token'
import { WRAP_SOL_ADDRESS } from '@/services/tokens/constant'
import { fetchResolvePriceScale, makeApiRequest } from '@/services/API/BaseMarket/chart'

const configurationData: TradingView.DatafeedConfiguration = {
  // Represents the resolutions for bars supported by your datafeed
  supported_resolutions: [
    '5',
    '15',
    '1H',
    '4H',
    '1D',
    '3D',
    '1W',
    '1M'
  ] as TradingView.ResolutionString[],
  // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
  exchanges: [{ value: 'OKX', name: 'OKX', desc: 'OKX' }],
  // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
  symbols_types: [{ name: 'crypto', value: 'crypto' }]
}

export interface DataFeedOptions {
  SymbolInfo?: TradingView.LibrarySymbolInfo
  DatafeedConfiguration?: TradingView.DatafeedConfiguration
  getBars?: TradingView.IDatafeedChartApi['getBars']
}

export const TV_SYMBOL_INFO_KEY = 'TV_SYMBOL_INFO' as const

export default class DataFeed
  implements TradingView.IExternalDatafeed, TradingView.IDatafeedChartApi
{
  private options: DataFeedOptions
  private lastBarsCache: Map<string, TradingView.Bar>

  constructor(options?: DataFeedOptions) {
    this.options = options ?? {}
    this.lastBarsCache = new Map()
    if (!this.options.DatafeedConfiguration) {
      this.options.DatafeedConfiguration = configurationData
    }
  }
  public async onReady(callback: TradingView.OnReadyCallback) {
    setTimeout(() => callback(configurationData))
  }

  public async searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback: TradingView.SearchSymbolsCallback
  ) {
    const symbols = await this.getAllSymbols()
    const newSymbols = symbols.filter((symbol) => {
      const isExchangeValid = exchange === '' || symbol.exchange === exchange
      const isFullSymbolContainsInput =
        symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1
      return isExchangeValid && isFullSymbolContainsInput
    })
    onResultReadyCallback(newSymbols)
  }

  private async getAllSymbols() {
    const allSymbols: any[] = []

    return allSymbols
  }

  public async resolveSymbol(
    symbolName: string,
    onSymbolResolvedCallback: TradingView.ResolveCallback,
    onResolveErrorCallback: TradingView.DatafeedErrorCallback,
    extension: TradingView.SymbolResolveExtension
  ) {
    const symbols = await this.getAllSymbols()
    const symbolItem = symbols.find(({ full_name }) => full_name === symbolName)

    const tokenInfo = JSON.parse(
      localStorage.getItem(TV_SYMBOL_INFO_KEY) || '{}'
    ) as Token
    const resolvedPriceScale = await fetchResolvePriceScale(get(tokenInfo, 'address', '').replace(WRAP_SOL_ADDRESS, ''))

    // Symbol information object
    const symbolInfo: Partial<TradingView.LibrarySymbolInfo> = {
      ticker: symbolName,
      name: symbolName,
      session: '24x7',
      timezone: 'Etc/UTC',
      minmov: 1,
      has_intraday: true,
      has_daily: true,
      has_empty_bars: true,
      pricescale: resolvedPriceScale,
      has_weekly_and_monthly: true,
      visible_plots_set: 'ohlcv',
      supported_resolutions: configurationData.supported_resolutions!,
      volume_precision: 1,
      data_status: 'streaming',
      logo_urls: [get(tokenInfo, 'image', '')],
      library_custom_fields: {
        tokenInfo
      }
    }
    onSymbolResolvedCallback(symbolInfo as TradingView.LibrarySymbolInfo)
  }

  public async getBars(
    symbolInfo: TradingView.LibrarySymbolInfo,
    resolution: TradingView.ResolutionString,
    periodParams: TradingView.PeriodParams,
    onHistoryCallback: TradingView.HistoryCallback,
    onErrorCallback: TradingView.DatafeedErrorCallback
  ) {
    const { firstDataRequest } = periodParams
    const tokenInfo = JSON.parse(localStorage.getItem(TV_SYMBOL_INFO_KEY) || '{}')

    const contractAddress = get(tokenInfo, 'address', '')

    const urlParameters = {
      network: 'solana',
      address: contractAddress,
      time_from: periodParams.from,
      time_to: periodParams.to,
      currency: 'usd',
      type: mapResolutionToTimeFormat(resolution)
    }
    const query = Object.keys(urlParameters)
      .map(
        (name) =>
          `${name}=${encodeURIComponent(
            urlParameters[name as keyof typeof urlParameters]
          )}`
      )
      .join('&')
    try {
      const data = await makeApiRequest(query)
      if (!data || data.length === 0) {
        // "noData" should be set if there is no data in the requested period
        onHistoryCallback([], { noData: true })
        return
      }
      const bars: {
        time: number
        low: any
        high: any
        open: any
        close: any
        volume: any
      }[] = data.items.map((item: any) => {
        return {
          time: item.unixTime * 1000,
          open: item.o,
          high: item.h,
          low: item.l,
          close: item.c,
          volume: item.v
        }
      })

      if (firstDataRequest) {
        this.lastBarsCache.set(get(symbolInfo, 'full_name', ''), {
          ...bars[bars.length - 1]
        })
      }

      onHistoryCallback(bars, { noData: bars?.length === 0 || !bars })
    } catch (error) {
      onErrorCallback(error as string)
    }
  }

  public async subscribeBars(
    symbolInfo: TradingView.LibrarySymbolInfo,
    resolution: TradingView.ResolutionString,
    onRealtimeCallback: TradingView.SubscribeBarsCallback,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void
  ) {
    // this.socket.subscribeOnStream(
    //   symbolInfo,
    //   resolution,
    //   onRealtimeCallback,
    //   subscriberUID,
    //   onResetCacheNeededCallback,
    //   this.lastBarsCache.get(symbolInfo.full_name)
    // );
  }

  public async unsubscribeBars(subscriberUID: string) {
    // this.socket.unsubscribeFromStream(subscriberUID);
  }
}
