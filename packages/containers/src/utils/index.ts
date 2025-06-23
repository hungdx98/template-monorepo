export * from './createSelectors';

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));