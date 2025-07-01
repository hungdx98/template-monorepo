import { produce } from "immer";
import { createStoreWithPersisted } from "../utils";
import { ITokenPayload, UserAction, UserState } from "./user.slice.types";

export const useUserStore = createStoreWithPersisted<UserState & UserAction>(
    (set, get) => ({
        deviceId: undefined,
        authentication: {
            token: undefined,
            adapterToken: undefined,
            apiToken: undefined,
            verifyToken: undefined,
        },
        updateAPIToken: (apiToken: ITokenPayload) => set(produce(state => {
            state.authentication = {
                ...state.authentication,
                ...apiToken,
            }
        })),
        updateUserToken: (userToken: string) => set(produce(state => {
            state.authentication = {
                ...state.authentication,
                token: userToken,
            }
        })),
        updateDeviceId: (deviceId: string) => set({ deviceId })
    }), {
    name: "auth",
});

