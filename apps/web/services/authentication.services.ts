import { nanoid } from "nanoid";
import { BaseOneID } from "./controllers";
import { IAuthentication, IUpdateAPIToken, IUpdateDeviceId, IUpdateUserToken, useUserStore } from "@/stores";

export class AuthenticationService {
    // variables to store user token, api token, and device id
    static authentication: IAuthentication = useUserStore.getState().authentication;
    static deviceId: string | undefined = useUserStore.getState().deviceId;
    // function to update user token, api token, and device id
    static updateUserToken: IUpdateUserToken = useUserStore.getState().updateUserToken;
    static updateAPIToken: IUpdateAPIToken = useUserStore.getState().updateAPIToken;
    static onUpdateDeviceId: IUpdateDeviceId = useUserStore.getState().updateDeviceId;

    public static initializeAuthentication = async () => {
        const isTokenExist = this.authentication.token;

        if (!isTokenExist) {
            const spamToken = process.env.NEXT_PUBLIC_SPAM_TOKEN as string
            this.updateUserToken(spamToken);
        }

        let currentDeviceId = this.deviceId;
        if (!currentDeviceId) {
            currentDeviceId = nanoid();
            this.onUpdateDeviceId(currentDeviceId);
        }

        if (!this.authentication.adapterToken) {
            const response: any = await BaseOneID.post('user/login-device', {
                device: this.deviceId,
            });

            if (response) {
                const { code: adapterToken, challenge: apiToken, verify: verifyToken = "", } = response;
                this.updateAPIToken({ apiToken, adapterToken, verifyToken, });
            }
        }
    };
}