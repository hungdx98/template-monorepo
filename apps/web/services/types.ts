export interface PositionInfo {
    nonce: string; // uint96
    operator: string; // address
    token0: string; // address
    token1: string; // address
    fee: number; // uint24
    tickLower: number; // int24
    tickUpper: number; // int24
    liquidity: string; // uint128
    feeGrowthInside0LastX128: string; // uint256
    feeGrowthInside1LastX128: string; // uint256
    tokensOwed0: string; // uint128
    tokensOwed1: string; // uint128
}

export interface IAddPosition {
    wallet: string; // Wallet address of the user
    token0: string; // Address of token0
    token1: string; // Address of token1
    amount0Desired: bigint; // Desired amount of token0 (e.g., 1000000000000000n for 0.001 token0 with 18 decimals)
    amount1Desired: bigint; // Desired amount of token1 (e.g., 2000000000000000n for 0.002 token1 with 18 decimals)
    fee: number; // Fee tier (e.g., 500, 3000, 10000)
    tickLower: number; // Lower tick boundary
    tickUpper: number; // Upper tick boundary
    deadline: string; // Deadline for the transaction (e.g., timestamp in seconds)
}

export interface ICreatePool {
    wallet: string; // Wallet address of the user
    rate: number; // Exchange rate (token1/token0)
    token0: string; // Address of token0
    token1: string; // Address of token1
    fee: number; // Fee tier (e.g., 500, 3000, 10000)
}