"use client";

import React, { createContext, PropsWithChildren, useContext } from 'react';
import { EPositionStep, IStatePosition, IStatePositionContext } from "./position.context.styles";
import { useGetSetState } from '@/hooks';

const PositionContext = createContext<IStatePositionContext>({} as IStatePositionContext);

const PositionProvider: React.FC<PropsWithChildren> = ({ children }) => {

    const [getState, setState] = useGetSetState<IStatePosition>({
        step: EPositionStep.token_pair,
    });

    const { step } = getState();

    const onChangeStep = (step: EPositionStep) => setState({ step });

    return (
        <PositionContext.Provider value={{
            state: {
                step,
            },
            jobs: {
                onChangeStep
            },
            ref: {}
        }}>
            {children}
        </PositionContext.Provider>
    );
};

const usePositionService = () => useContext(PositionContext);

export { PositionProvider, usePositionService };
