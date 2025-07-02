import React from 'react';
import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl';
import { ViewportProvider } from '@/context/viewportContext';



interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  const locale = useLocale();
  const messages = useMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ViewportProvider>{children}</ViewportProvider>
      {/* {children} */}
    </NextIntlClientProvider>
  );
};

export default Providers;
