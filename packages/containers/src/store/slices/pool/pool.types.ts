export type PoolState = {
    poolAddress: string
}
export type PoolAction = {
    setPoolAddress: (srcAvatar: string) => void;
}