"use client";

import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { EPositionStep, IStatePositionContext, IStatePositionPairTokens } from "./type";



const PositionContext = createContext<IStatePositionContext>({} as IStatePositionContext);

const PositionProvider: React.FC<PropsWithChildren> = ({ children }) => {

   const [step, setStep] = useState<EPositionStep>(EPositionStep.token_pair);

   const [pairTokens, setPairTokens] = useState<IStatePositionPairTokens>({
    token0: undefined,
    token1: undefined
   })


    const onChangeStep = (step: EPositionStep) => setStep(step);

    const onSelectPairToken = (type: 'token0' | 'token1', token:any) => {
        setPairTokens((prev) => ({
            ...prev,
            [type]: token
        }));
    };

    return (
        <PositionContext.Provider value={{
            state: {
                step,
                pairTokens
            },
            jobs: {
                onChangeStep,
                onSelectPairToken
            },
            ref: {}
        }}>
            {children}
        </PositionContext.Provider>
    );
};

const usePositionContext = () => useContext(PositionContext);

export { PositionProvider, usePositionContext };
