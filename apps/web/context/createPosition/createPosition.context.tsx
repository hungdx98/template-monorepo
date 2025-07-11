"use client";

import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { EFeeTier, EPositionStep, IStatePositionContext, IStatePositionPairTokens } from "./type";
import { PeripheryService } from '@/services';
import { Token } from '@repo/utils/types';
import { useWallet } from '@coin98-com/wallet-adapter-react';
import { EvmEngine } from "@wallet/evm";
import { useBaseStore } from '@/stores';
import { useShallow } from 'zustand/shallow';
import { NFT_POSITION_MANANGER_ADDRESS } from '@/services/types';
import { convertBalanceToWei, convertWeiToBalance } from '@wallet/utils';
import { calculateTicks } from '@/utils';
import get from 'lodash/get';

const PositionContext = createContext<IStatePositionContext>({} as IStatePositionContext);

const PositionProvider: React.FC<PropsWithChildren> = ({ children }) => {

    const { address = '', sendTransaction } = useWallet();
      const [baseService] = useBaseStore(useShallow(state => [
            state.baseService
        ]));
    

    const [step, setStep] = useState<EPositionStep>(EPositionStep.token_pair);
    const [isCreatedPool, setIsCreatedPool] = useState(false);
    const [initialRate, setInitialRate] = useState<string>('0');

    

    const [pairTokens, setPairTokens] = useState<IStatePositionPairTokens>({
        token0: undefined,
        token1: undefined
    })

    const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
        min: '',
        max: ''
    })

    const [depositAmount, setDepositAmount] = useState<{
        base: string;
        pair: string;
    }>({
        base: '',
        pair: ''
    });

    const [allowanceAmount, setAllowanceAmount] = useState({
        base: '0',
        pair: '0'
    })

    const [feeTier, setFeeTier] = useState<EFeeTier>(EFeeTier.STANDARD);


    const onCheckAllowance = async (token: Token): Promise<string> => {
        const sAllowance = await baseService?.checkAllowance({
            chain: 'tomo',
            owner: address as string,
            tokenAddress: token?.address as string,
            spender: NFT_POSITION_MANANGER_ADDRESS
        })

        const convertAllowance = convertWeiToBalance(String(Number(sAllowance || '0')), token.decimals || 18); 
        return convertAllowance || '0';
    }

    const onChangeStep = (stepProps: EPositionStep)  => {
        if (stepProps === EPositionStep.token_pair && step !== stepProps && isContinue) {
            setFeeTier(EFeeTier.STANDARD);
            setStep(stepProps);
            setPairTokens({
                token0: undefined,
                token1: undefined
            });
            return;
        }
        setStep(stepProps);
    }

    const onChangePriceRange = (type: 'min' | 'max') => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPriceRange((prev) => ({
            ...prev,
            [type]: value
        }));

        setDepositAmount({ base: '', pair: ''} )
        
    }

    const onChangeDepositAmount = (type: 'base' | 'pair') => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDepositAmount((prev) => ({
            ...prev,
            [type]: value
        }));
    }

    const onSelectPairToken = (type: 'token0' | 'token1', token: Token) => {
        setPairTokens((prev) => ({
            ...prev,
            [type]: token
        }));
    };

    const onSelectFeeTier = (fee: EFeeTier) => () => {
        setFeeTier(fee);
    };

    const clearState = () => {
       setDepositAmount({
        base: '',
        pair: ''
       })
    }

    const isPoolCreated = async (fee: string): Promise<boolean> => {
        if (!isContinue) return false
        const feeTier = Number(fee) * 10000; // Convert fee to basis points
        // This function can be used to check if the pool is created
        if (!pairTokens.token0 || !pairTokens.token1) {
            return false
        }
        const poolAddress = await PeripheryService.getPoolAddress(
            pairTokens.token0.address as string,
            pairTokens.token1.address as string,
            feeTier
        )

        console.log("poolAddress", {poolAddress, pairTokens});
        return !!poolAddress
    };

    const onCreatePool = async () => {
        console.log("onCreatePool", {pairTokens, feeTier, initialRate});
        const rate = Number(get(pairTokens, 'token1.market.current_price', 0)) / Number(get(pairTokens, 'token0.market.current_price', 0));
        const txData = await PeripheryService.createPool({
            wallet: address as string,
            rate: Number(rate), // Replace with actual rate
            token0: pairTokens.token0?.address as string,
            token1: pairTokens.token1?.address as string,
            fee: Number(feeTier) * 10000 // Convert fee to basis points
        })

        const result = await sendTransaction({
            ...txData,
            gasPrice: '0x0',
            gasLimit: '0x0'
        })

        console.log("result create pool", result);
        return get(result, 'data', '')

    }

    const onApproveToken = async (token: Token, amount:string) => {

        const rawAmount = !amount || Number(amount) === 0
            ? '0'
            : convertBalanceToWei(amount, token.decimals || 18);

        const txData = await PeripheryService.approveToken({
            wallet: address as string,
            token: token,
            amount: rawAmount // Approve maximum amount
        });

        const result = await sendTransaction({
            ...txData,
            gasPrice: '0x0',
            gasLimit: '0x0'
        })

        console.log("approval hash", result);
    }

    const onRevokeToken = async () => {
        const hash1 = await onApproveToken(pairTokens.token0 as Token, '0');
        console.log("revoke base token", hash1);
        const hash2 = await onApproveToken(pairTokens.token1 as Token, '0');  
        console.log("revoke pair token", hash2);
    }

    const onAddPoolLiquidity = async () => {
        if(!isCreatedPool){
            const hasCreatePool = await onCreatePool()

            if(hasCreatePool) setIsCreatedPool(true);
            if (!hasCreatePool) {
                return new Error("Failed to create pool");
            }
        }

        console.log("allowanceAmount", allowanceAmount)
        console.log("depositAmount", depositAmount)

        if (Number(allowanceAmount.base) < Number(depositAmount.base || '0')) {
            const hash1 = await onApproveToken(pairTokens.token0 as Token, depositAmount.base || '0');
            console.log("approve base token", hash1);
        }
        if (Number(allowanceAmount.pair) < Number(depositAmount.pair || '0')) {
            const hash2 = await onApproveToken(pairTokens.token1 as Token, depositAmount.pair || '0');
            console.log("approve pair token", hash2);
        }

        const tickSpacing = await PeripheryService.getTickSpacingForFee(Number(feeTier) * 10000);

        console.log("tickSpacing", tickSpacing);
        // const price = Number(pairTokens.token0?.market?.current_price || 1) / Number(pairTokens.token1?.market?.current_price || 1);

        const lowerTick = calculateTicks(Number(priceRange.min), Number(tickSpacing), 10);
        const upperTick = calculateTicks(Number(priceRange.max), Number(tickSpacing), 10);

        console.log("calTick", {lowerTick,upperTick, tickSpacing});

        const rawBaseAmount = convertBalanceToWei(depositAmount.base || '0', pairTokens.token0?.decimals || 18);
        const rawPairAmount = convertBalanceToWei(depositAmount.pair || '0', pairTokens.token1?.decimals || 18);
        const txData = await PeripheryService.addPosition({
            wallet: address as string,
            token0: pairTokens.token0?.address as string,
            token1: pairTokens.token1?.address as string,
            amount0Desired: BigInt(rawBaseAmount || '0'),
            amount1Desired: BigInt(rawPairAmount || '0'),
            tickLower: Number(lowerTick.tickLower) || 0, // Convert to number
            tickUpper: Number(upperTick.tickUpper) || 0, // Convert to number
            fee: Number(feeTier) * 10000, // Convert fee to basis points,
            deadline: Math.floor(Date.now() / 1000) + 60 * 300 // 300 minutes from now
        })

        const result = await sendTransaction({
            ...txData,
            gasLimit: '0x0',
            gasPrice: '0x0',
            gas: '0x0'
        })

        return get(result, 'data', '')

    }

    const calculateDepositAmount = (amountIn:string) => {
        const L1 = Math.sqrt(Number(priceRange.max)) * Math.sqrt(Number(initialRate)) * Number(amountIn) / (Math.sqrt(Number(priceRange.max)) - Math.sqrt(Number(initialRate)));
        const L2 = (Math.sqrt(Number(priceRange.max)) - Math.sqrt(Number(initialRate))) / Number(amountIn);
        const L = Math.min(L1, L2);
        const amountOut = L * (Math.sqrt(Number(priceRange.max)) - Math.sqrt(Number(initialRate)));

        return amountOut.toFixed(6)
    }

    const [isContinue] = useMemo(() => {
        const ctn = !!pairTokens.token0 && !!pairTokens.token1 && !!feeTier;
        return [ctn];
    }, [pairTokens, feeTier]);

    return (
        <PositionContext.Provider value={{
            state: {
                step,
                pairTokens,
                feeTier,
                priceRange,
                depositAmount,
                isCreatedPool,
                initialRate,
                isContinue
            },
            jobs: {
                onChangeStep,
                setIsCreatedPool,
                onCreatePool,
                onChangeDepositAmount,
                setDepositAmount,
                setPairTokens,
                setPriceRange,
                onChangePriceRange,
                onSelectPairToken,
                isPoolCreated,
                onSelectFeeTier,
                onCheckAllowance,
                setAllowanceAmount,
                onAddPoolLiquidity,
                setInitialRate,
                clearState,
                calculateDepositAmount,
                onRevokeToken
            }
        }}>
            {children}
        </PositionContext.Provider>
    );
};

const useCreatePositionContext = () => useContext(PositionContext);

export { PositionProvider, useCreatePositionContext };
