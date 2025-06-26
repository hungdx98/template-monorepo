import React from 'react';
import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const locale = useLocale();
  const messages = useMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* <ViewportProvider>{children}</ViewportProvider> */}
      {children}
    </NextIntlClientProvider>
  );
};
