"use client"

import React, { useCallback, useRef, useReducer } from 'react'

const updateReducer = (num: number): number => (num + 1) % 1_000_000

export function useUpdate(): () => void {
    const [, update] = useReducer(updateReducer, 0)

    return update
}

export const useGetSet = <T = any>(initialState: T) => {
    const state = useRef<Partial<T>>(initialState)
    const [, update] = useReducer(() => ({}), {})

    return React.useMemo<[() => Partial<T>, (toUpdateState: Partial<T>) => void]>(
        () => [
            () => state.current,
            newState => {
                state.current = newState
                update()
            }
        ],
        []
    )
}

export const useGetSetState = <T extends object>(
    initialState: T = {} as T
): [() => T, (patch: Partial<T>) => void] => {
    const update = useUpdate()
    const state = useRef<T>({ ...(initialState as object) } as T)
    const get = useCallback(() => state.current, [])
    const set = useCallback((patch: Partial<T>) => {
        if (!patch) {
            return
        }
        Object.assign(state.current, patch)
        update()
    }, [])

    return [get, set]
}