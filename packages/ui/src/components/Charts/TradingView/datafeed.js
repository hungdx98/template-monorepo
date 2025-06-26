"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TV_SYMBOL_INFO_KEY = void 0;
const get_1 = __importDefault(require("lodash/get"));
const helpers_1 = require("./helpers");
const constant_1 = require("@/services/tokens/constant");
const chart_1 = require("@/services/API/BaseMarket/chart");
const configurationData = {
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
    ],
    // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
    exchanges: [{ value: 'OKX', name: 'OKX', desc: 'OKX' }],
    // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
    symbols_types: [{ name: 'crypto', value: 'crypto' }]
};
exports.TV_SYMBOL_INFO_KEY = 'TV_SYMBOL_INFO';
class DataFeed {
    options;
    lastBarsCache;
    constructor(options) {
        this.options = options ?? {};
        this.lastBarsCache = new Map();
        if (!this.options.DatafeedConfiguration) {
            this.options.DatafeedConfiguration = configurationData;
        }
    }
    async onReady(callback) {
        setTimeout(() => callback(configurationData));
    }
    async searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
        const symbols = await this.getAllSymbols();
        const newSymbols = symbols.filter((symbol) => {
            const isExchangeValid = exchange === '' || symbol.exchange === exchange;
            const isFullSymbolContainsInput = symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
            return isExchangeValid && isFullSymbolContainsInput;
        });
        onResultReadyCallback(newSymbols);
    }
    async getAllSymbols() {
        const allSymbols = [];
        return allSymbols;
    }
    async resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension) {
        const symbols = await this.getAllSymbols();
        const symbolItem = symbols.find(({ full_name }) => full_name === symbolName);
        const tokenInfo = JSON.parse(localStorage.getItem(exports.TV_SYMBOL_INFO_KEY) || '{}');
        const resolvedPriceScale = await (0, chart_1.fetchResolvePriceScale)((0, get_1.default)(tokenInfo, 'address', '').replace(constant_1.WRAP_SOL_ADDRESS, ''));
        // Symbol information object
        const symbolInfo = {
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
            supported_resolutions: configurationData.supported_resolutions,
            volume_precision: 1,
            data_status: 'streaming',
            logo_urls: [(0, get_1.default)(tokenInfo, 'image', '')],
            library_custom_fields: {
                tokenInfo
            }
        };
        onSymbolResolvedCallback(symbolInfo);
    }
    async getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) {
        const { firstDataRequest } = periodParams;
        const tokenInfo = JSON.parse(localStorage.getItem(exports.TV_SYMBOL_INFO_KEY) || '{}');
        const contractAddress = (0, get_1.default)(tokenInfo, 'address', '');
        const urlParameters = {
            network: 'solana',
            address: contractAddress,
            time_from: periodParams.from,
            time_to: periodParams.to,
            currency: 'usd',
            type: (0, helpers_1.mapResolutionToTimeFormat)(resolution)
        };
        const query = Object.keys(urlParameters)
            .map((name) => `${name}=${encodeURIComponent(urlParameters[name])}`)
            .join('&');
        try {
            const data = await (0, chart_1.makeApiRequest)(query);
            if (!data || data.length === 0) {
                // "noData" should be set if there is no data in the requested period
                onHistoryCallback([], { noData: true });
                return;
            }
            const bars = data.items.map((item) => {
                return {
                    time: item.unixTime * 1000,
                    open: item.o,
                    high: item.h,
                    low: item.l,
                    close: item.c,
                    volume: item.v
                };
            });
            if (firstDataRequest) {
                this.lastBarsCache.set((0, get_1.default)(symbolInfo, 'full_name', ''), {
                    ...bars[bars.length - 1]
                });
            }
            onHistoryCallback(bars, { noData: bars?.length === 0 || !bars });
        }
        catch (error) {
            onErrorCallback(error);
        }
    }
    async subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
        // this.socket.subscribeOnStream(
        //   symbolInfo,
        //   resolution,
        //   onRealtimeCallback,
        //   subscriberUID,
        //   onResetCacheNeededCallback,
        //   this.lastBarsCache.get(symbolInfo.full_name)
        // );
    }
    async unsubscribeBars(subscriberUID) {
        // this.socket.unsubscribeFromStream(subscriberUID);
    }
}
exports.default = DataFeed;
