export enum MESSAGE_SOCKET_TYPE {
    ASSET_BALANCE = 'asset_balance',
    SUBCRISE_ADDRESS = 'subscribe_address'
}

export interface IEventMessageSocket {
    type: MESSAGE_SOCKET_TYPE
    data: {
        chain: string
        address: string
        contract: string
    }
}

export interface IEmitBalance {
    chain: string
    address: string
    contract: string
}