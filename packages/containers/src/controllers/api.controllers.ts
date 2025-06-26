import axios, { AxiosResponse } from "axios";
import crypto from "crypto-js";
import get from "lodash/get";
import QueryString from "query-string";
import { useUserStore } from "../store";

const DEFAULT_TIMEOUT = 120000;
const SOURCE = "C98SUPAGEIR";
const VERSION = "15.9.4";
// const isStaging = process.env.NODE_ENV === "development";
const isStaging = false;

const headers = {
    Accept: 'application/json',
    'content-type': 'application/json',
    Source: SOURCE,
    Version: VERSION
};

const API_ENDPOINT_KEY = {
    BaseAssets: 'https://assets-api.coin98.tech',
    BaseRouter: isStaging ? 'https://superlink-v2-router-stg.coin98.dev' : 'https://superlink-server.coin98.tech',
    BaseSwap: isStaging ? "https://superlink-server-stg.coin98.dev" : 'https://superlink-server.coin98.tech',
    BaseMarket: "https://superwallet-markets.coin98.tech",
    BaseAPI: process.env.NEXT_PUBLIC_API,
    BaseAdapter: process.env.NEXT_PUBLIC_ADAPTER,
    BaseOneID: 'https://api.oneid.xyz/',
}

export const BaseAPI = axios.create({
    baseURL: API_ENDPOINT_KEY.BaseAPI,
    timeout: DEFAULT_TIMEOUT,
});

export const BaseSwap = axios.create({
    baseURL: API_ENDPOINT_KEY.BaseSwap,
    timeout: DEFAULT_TIMEOUT,
    ...headers
});

export const BaseOneID = axios.create({
    baseURL: API_ENDPOINT_KEY.BaseOneID,
    timeout: DEFAULT_TIMEOUT,
});

export const BaseMarket = axios.create({
    baseURL: API_ENDPOINT_KEY.BaseMarket,
    timeout: DEFAULT_TIMEOUT,
});

export const BaseAssets = axios.create({
    baseURL: API_ENDPOINT_KEY.BaseAssets,
    timeout: DEFAULT_TIMEOUT,
});

export const BaseRouter = axios.create({
    baseURL: API_ENDPOINT_KEY.BaseRouter,
    timeout: DEFAULT_TIMEOUT,
});

export const BaseAdapter = axios.create({
    baseURL: process.env.NEXT_PUBLIC_ADAPTER,
    timeout: DEFAULT_TIMEOUT,
});

const RequestInterceptor =
    (isAdapter: boolean) => (config: any) => {
        const { apiToken, adapterToken } = useUserStore.getState().authentication;

        const spamToken = get(process, 'env.NEXT_PUBLIC_SPAM_TOKEN', "");

        const token = isAdapter ? adapterToken : apiToken;

        config.headers = {
            os: "extension",
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Source: SOURCE,
            Version: VERSION,
            ...config.headers,
        };

        // const signature = signaturizeRequest({})
        config.transformRequest = (data: any) => {
            let passwordHash: string = "";

            if (config.method === "post") {
                passwordHash = JSON.stringify(data || {});
                config.headers.signature = crypto.HmacSHA256(passwordHash, spamToken);
            }

            if (config.method === "get") {
                passwordHash = QueryString.stringify(config.params || {});
            }

            config.headers.signature = crypto.HmacSHA256(passwordHash, spamToken);
            config.headers['Content-Type'] = 'application/json';
            return JSON.stringify(data);
        };

        // Transform data before working with api
        return config;
    };

export const InfoAPI = axios.create({
    baseURL: process.env.NEXT_PUBLIC_INFO_API,
    timeout: DEFAULT_TIMEOUT,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Version: "1",
        Authorization: "Bearer token",
        Signature:
            "c26340d5243d802f03de751b9cbc049557ad0a14296aacf4a37dc7399adbe65c",
        Source: SOURCE,
    },
});

const URLS_RETURN_DATA = [
    'smartRouter/calculator',
    'smartRouter/callData',
    'smartRouter/fiat',
];

const ResponseInterceptor = (response: AxiosResponse) => {
    if (!response.data) {
        return Promise.reject(new Error("Data not found"));
    }
    const urlReturnData = URLS_RETURN_DATA.find(
        (url) => response.config?.url === url
    );

    if (urlReturnData) {
        return response?.data;
    }

    if (response.data?.data) {
        return response.data?.data;
    }

    return response.data;
};

const renewToken = async (): Promise<void> => {
    const { verifyToken } = useUserStore.getState().authentication;
    const updateAPIToken = useUserStore.getState().updateAPIToken

    const response: any = await BaseOneID.post("user/renew-token", undefined, {
        headers: {
            verify: `Bearer ${verifyToken}`,
        },
    });

    const { code, verify } = response;

    updateAPIToken({
        adapterToken: code,
        verifyToken: verify,
    });
};

const ErrorHandler = async (error: any) => {
    return Promise.reject(error);
};

BaseAdapter.interceptors.request.use(RequestInterceptor(true), ErrorHandler);
BaseAdapter.interceptors.response.use(ResponseInterceptor, ErrorHandler);

BaseSwap.interceptors.request.use(RequestInterceptor(false), ErrorHandler);
BaseSwap.interceptors.response.use(ResponseInterceptor, ErrorHandler);

BaseAPI.interceptors.request.use(RequestInterceptor(true), ErrorHandler);
BaseAPI.interceptors.response.use(ResponseInterceptor, ErrorHandler);

BaseOneID.interceptors.request.use(RequestInterceptor(false), ErrorHandler);
BaseOneID.interceptors.response.use(ResponseInterceptor, ErrorHandler);

BaseMarket.interceptors.request.use(RequestInterceptor(false), ErrorHandler);
BaseMarket.interceptors.response.use(ResponseInterceptor, ErrorHandler);

BaseRouter.interceptors.request.use(RequestInterceptor(false), ErrorHandler);
BaseRouter.interceptors.response.use(ResponseInterceptor, ErrorHandler);

BaseAssets.interceptors.request.use(RequestInterceptor(false), ErrorHandler);
BaseAssets.interceptors.response.use(ResponseInterceptor, ErrorHandler);

InfoAPI.interceptors.response.use(ResponseInterceptor, ErrorHandler)