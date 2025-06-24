
'use client';
import Image from 'next/image';
import React, { useEffect } from 'react';
import Button from '../../components/Button';
const MainHeader = () => {

  useEffect(() => {
    const element = document.getElementsByTagName('html')
    element.item(0)?.classList.add('dark');
  }, []);


  return (
    <div className="flex items-center justify-between p-4 bg-gray-800">
      <div className='flex items-center gap-x-4'>
        <Image
          width={40}
          height={40}
          alt="Baryon Logo"
          src={'/images/logo/baryon.svg'}
        />
        <h1>BARYON</h1>
      </div>
      
      <Button className='max-w-24'>Connect</Button>
     
    </div>
  );
}
 
export default MainHeader;