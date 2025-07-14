import { CalculateTicksProps, CalculateTicksReturn } from "./types";

export const CONSECUTIVE_TICKS_RATIO = 1.0001;
// Update the function signature to use the types
export const calculateTicks = (
    price: CalculateTicksProps['price'],
    tickSpacing: CalculateTicksProps['tickSpacing'],
    tickRange: CalculateTicksProps['tickRange'] = 10
): CalculateTicksReturn => {
    /// @dev The minimum tick that may be passed to #getSqrtRatioAtTick computed from log base 1.0001 of 2**-128
    const MIN_TICK = -887272;
    /// @dev The maximum tick that may be passed to #getSqrtRatioAtTick computed from log base 1.0001 of 2**128
    const MAX_TICK = -MIN_TICK;
    const rawTick = Math.floor(Math.log(price) / Math.log(1.0001));

    // Làm tròn tick về gần tick hợp lệ theo tickSpacing
    const alignedTick = Math.floor(rawTick / tickSpacing) * tickSpacing;

    // Mở rộng phạm vi
    const tickLower = alignedTick - tickSpacing * tickRange;
    const tickUpper = alignedTick + tickSpacing * tickRange;

    // Đảm bảo nằm trong giới hạn cho phép
    const lower = Math.max(tickLower, MIN_TICK);
    const upper = Math.min(tickUpper, MAX_TICK);

    return {
        tickLower: lower,
        tickUpper: upper,
        currentTick: alignedTick,
    };
};

export const convertSqrtPriceX96 = (sqrtPriceX96: number) => {
    const bigNumberSqrtPriceX96 = Number(sqrtPriceX96);
    console.log('bigNumberSqrtPriceX96', bigNumberSqrtPriceX96);
    return (bigNumberSqrtPriceX96 / (2 ** 96)) ** 2;
}   