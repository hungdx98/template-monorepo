export interface ITokenPayload {
    apiToken?: string;
    adapterToken?: string;
    verifyToken?: string;
}

export interface IAuthentication {
    // user token
    token?: string
    // api token
    apiToken?: string;
    adapterToken?: string;
    verifyToken?: string;
}

export interface UserState {
    deviceId?: string
    authentication: IAuthentication
}

export interface UserAction {
    updateAPIToken: IUpdateAPIToken;
    updateUserToken: IUpdateUserToken;
    updateDeviceId: IUpdateDeviceId;
}

export type IUpdateAPIToken = (apiToken: ITokenPayload) => void;

export type IUpdateUserToken = (userToken: string) => void;

export type IUpdateDeviceId = (deviceId: string) => void;