import { Token } from "@repo/utils/types";
import { formatNumberBro } from '@wallet/utils';
import get from "lodash/get";
import Image from "next/image";
interface TokenItemProps {
  token: Token; // Define the type of token as needed
}
export default function TokenItem({ token }: TokenItemProps) {

  return (
    <div className="cursor-pointer flex items-center justify-between p-4 bg-background-2-active rounded-2xl shadow-md w-full max-w-md">
      <div className="flex items-center space-x-4">
        <div className="relative w-12 h-12 rounded-full flex items-center justify-center">
          <Image width={48} height={48} src={get(token, 'image')} alt="token" className="rounded-full" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{get(token, 'name')}</h2>
          <p className="text-sm text-text-subtle">{get(token, 'symbol')}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold">{formatNumberBro(get(token, 'balance', '0'), 6)}</p>
        <p className="text-sm text-text-subtle">${formatNumberBro(get(token, 'fiat', '0'), 4)}</p>
      </div>
    </div>
  );
}
