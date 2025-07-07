import { truncate } from "@wallet/utils";

const ToastSuccess = ({message, hash}: {message: string, hash?: string}) => {

  const openScan = () => {
    window.open(`https://www.vicscan.xyz/tx/${hash}`)
  }
  return (
    <div>
      <div className='flex justify-between items-center'>
        <p>{message}</p>
      {/* <i className="fa fa-times" aria-hidden="true"></i> */}
      </div>
      <p className="text-left text-text-subtle hover:opacity-70" onClick={openScan}>{truncate(hash || '')}</p>
    </div>
  );
}
 
export default ToastSuccess;