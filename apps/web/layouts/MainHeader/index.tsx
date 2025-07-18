
'use client';
import Image from 'next/image';
import Button from '../../components/Button';
import { useWalletModal } from '@coin98-com/wallet-adapter-react-ui';
import { useWallet } from '@coin98-com/wallet-adapter-react';
import { useMemo, useState } from 'react';
import { truncate } from '@repo/utils/helpers';
import LeftHeader from './components/LeftHeader';
import { useRouter } from 'next/navigation';

const MainHeader = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { openWalletModal } = useWalletModal();
  const { connected, disconnect, address = '' } = useWallet();

  const router = useRouter();


  const navigateHome = () => {
    router.push('/');
  }

 

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      openWalletModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const renderButtonConnect = useMemo(() => {
    const onClickFunc = connected ? disconnect : handleLogin;
    const content = connected ? truncate(address as string) : 'Connect wallet'
    if (connected) {
      return <div className='flex items-center space-x-2'>
        <div className='flex items-center space-x-2 cursor-pointer' onClick={onClickFunc}>
          <Image
            className='rounded-full'
            width={24}
            height={24}
            alt="Superlink"
            src="/images/logo/coin98-logo.svg"
          />
          <span className='text-t-body-medium' >{content}</span>
        </div>
      </div>
    }
    return <Button size='md' className='whitespace-nowrap w-fit' onClick={onClickFunc}>{content}</Button>
  }, [isLoading, connected, address]);




  return (
    <div>
      <div className="flex items-center justify-between p-4 border border-border-1-subtle sticky top-0 z-50 bg-background h-20">
        <div className='flex items-center gap-x-4'>

          <div className='flex items-center gap-x-4 cursor-pointer' onClick={navigateHome}>
            <Image
              width={40}
              height={40}
              alt="Baryon Logo"
              src={'/images/logo/baryon.svg'}
            />
            <h1>BARYON</h1>
          </div>
          <LeftHeader />
        </div>
        {renderButtonConnect}
      </div>
     
    </div>
   
  );
}

export default MainHeader;