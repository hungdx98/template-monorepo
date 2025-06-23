import type { } from 'immer'
import { type StateCreator, create } from 'zustand'
import { type DevtoolsOptions, PersistOptions, createJSONStorage, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export const createStore = <T>(initializer: StateCreator<T, [
  ['zustand/devtools', never], ['zustand/immer', never]
], [], T>, options: DevtoolsOptions = { }) => create<T>()(devtools(immer(initializer), options))

export const createStoreWithPersisted = <T>(initializer: StateCreator<T, [['zustand/persist', unknown], ['zustand/immer', never]], [], T>, options: PersistOptions<T, T> = { name: '' }) => create<T>()(devtools(persist(immer(initializer), {
  ...options,
  storage: createJSONStorage(() => localStorage)
})))