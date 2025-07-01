import { BaseWallet } from "@wallet/base";
import { create } from "zustand";
import { IBaseSettingAction, IBaseSettingState } from "./base.slice.types";

const defaultState = {
    baseService: undefined,
}

export const useBaseStore = create<IBaseSettingState & IBaseSettingAction>(
    (set) => ({
        ...defaultState,
        updateBaseService: (baseService: InstanceType<typeof BaseWallet>) => set({ baseService }),
    })
)