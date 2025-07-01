import { BaseWallet } from "@wallet/base";
import { Draft } from "immer";

export interface IBaseSettingState {
    baseService: InstanceType<typeof BaseWallet> | undefined;
}

export interface IBaseSettingAction {
    updateBaseService: (baseService: InstanceType<typeof BaseWallet>) => void;
}