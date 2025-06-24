
import Image from 'next/image';
import React from 'react';
import Button from '../../components/Button';
const MainHeader = () => {
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