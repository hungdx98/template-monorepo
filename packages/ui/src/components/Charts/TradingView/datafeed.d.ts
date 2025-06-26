export interface DataFeedOptions {
    SymbolInfo?: TradingView.LibrarySymbolInfo;
    DatafeedConfiguration?: TradingView.DatafeedConfiguration;
    getBars?: TradingView.IDatafeedChartApi['getBars'];
}
export declare const TV_SYMBOL_INFO_KEY: "TV_SYMBOL_INFO";
export default class DataFeed implements TradingView.IExternalDatafeed, TradingView.IDatafeedChartApi {
    private options;
    private lastBarsCache;
    constructor(options?: DataFeedOptions);
    onReady(callback: TradingView.OnReadyCallback): Promise<void>;
    searchSymbols(userInput: string, exchange: string, symbolType: string, onResultReadyCallback: TradingView.SearchSymbolsCallback): Promise<void>;
    private getAllSymbols;
    resolveSymbol(symbolName: string, onSymbolResolvedCallback: TradingView.ResolveCallback, onResolveErrorCallback: TradingView.DatafeedErrorCallback, extension: TradingView.SymbolResolveExtension): Promise<void>;
    getBars(symbolInfo: TradingView.LibrarySymbolInfo, resolution: TradingView.ResolutionString, periodParams: TradingView.PeriodParams, onHistoryCallback: TradingView.HistoryCallback, onErrorCallback: TradingView.DatafeedErrorCallback): Promise<void>;
    subscribeBars(symbolInfo: TradingView.LibrarySymbolInfo, resolution: TradingView.ResolutionString, onRealtimeCallback: TradingView.SubscribeBarsCallback, subscriberUID: string, onResetCacheNeededCallback: () => void): Promise<void>;
    unsubscribeBars(subscriberUID: string): Promise<void>;
}
//# sourceMappingURL=datafeed.d.ts.map