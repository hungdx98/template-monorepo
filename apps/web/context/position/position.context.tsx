"use client";

import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { EFeeTier, EPositionStep, IStatePositionContext, IStatePositionPairTokens } from "./type";
import { PeripheryService } from '@/services';
import { Token } from '@repo/utils/types';


const PositionContext = createContext<IStatePositionContext>({} as IStatePositionContext);

const PositionProvider: React.FC<PropsWithChildren> = ({ children }) => {

    const [step, setStep] = useState<EPositionStep>(EPositionStep.token_pair);

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

    const [feeTier, setFeeTier] = useState<EFeeTier>(EFeeTier.STANDARD);

    const onChangeStep = (stepProps: EPositionStep) => () => {
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
        return !!poolAddress
    };

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
                isContinue
            },
            jobs: {
                onChangeStep,
                onChangeDepositAmount,
                onChangePriceRange,
                onSelectPairToken,
                isPoolCreated,
                onSelectFeeTier
            },
            ref: {}
        }}>
            {children}
        </PositionContext.Provider>
    );
};

const usePositionContext = () => useContext(PositionContext);

export { PositionProvider, usePositionContext };
