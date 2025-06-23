'use client';
import { WalletProvider } from '@coin98-com/wallet-adapter-react';
import { WalletModalProvider } from '@coin98-com/wallet-adapter-react-ui';
import {
    CHAINS_SUPPORTED_ADAPTER,
    DEFAULT_CHAINS,
    WALLETS_SUPPORTED
} from '@repo/utils/constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode, useState } from 'react';
import dynamic from 'next/dynamic';

interface AdapterProviderProps {
    children: ReactNode;
}

const DynamicWalletModalC98 = dynamic(
    async () =>
        import('@coin98-com/wallet-adapter-react-ui').then(
            (mod) => mod.WalletModalC98,
        ),
    { ssr: false },
);

export const AdapterProvider: FC<AdapterProviderProps> = ({ children }) => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false, // Prevents re-fetching when tab gains focus
                refetchOnReconnect: false, // Prevents re-fetching when reconnecting to the internet
            }
        }
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <WalletProvider
                wallets={WALLETS_SUPPORTED}
                enables={CHAINS_SUPPORTED_ADAPTER}
                autoConnect
                keepConnectionOnDisconnected
            >
                <WalletModalProvider theme='light'>
                    <DynamicWalletModalC98
                        isC98Theme
                        enableChains={DEFAULT_CHAINS}
                    />
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </QueryClientProvider>

    );
};