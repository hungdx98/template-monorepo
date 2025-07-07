'use client';

import { cssTransition, ToastContainer as ToastComp } from 'react-toastify';

const ToastContainer = () => {

  const zoomEffect = cssTransition({
    enter: 'animate__animated animate__faster animate__fadeInDownBig',
    exit: 'animate__animated animate__faster animate__fadeOutUpBig'
  })
  return (
    <ToastComp
      position="bottom-right"
      autoClose={2000}
      hideProgressBar
      newestOnTop={true}
      closeOnClick
      limit={1}
      rtl={false}
      // theme={theme}
      closeButton={false}
      transition={zoomEffect}
    />
  );
}
 
export default ToastContainer;