import { BigNumber } from 'ethers';

export const applySlippage = (amountOut: BigNumber, slippagePercent: number): BigNumber => {
    const amountOutBN = BigNumber.from(amountOut);
    const numerator = BigNumber.from(10000 - slippagePercent * 100); // e.g. 0.5% → 9950
    return amountOutBN.mul(numerator).div(10000);
}

export const generateErrorMessage = (error: any) => {
    return JSON.stringify(error?.message || error || 'Something went wrong', null, 2).replace(/"/g, '')
}