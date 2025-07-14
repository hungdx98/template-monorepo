import { Input } from "../Input";
import Image from "next/image";
import get from "lodash/get";
import { formatNumberBro } from "@wallet/utils";
import { Token } from "@repo/utils/types";

interface TokenInputProps {
  token: Token | undefined,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}
const TokenInput = (props: TokenInputProps) => {
  const {token, value, onChange} = props;

  const price = get(token, 'market.current_price', 0);

  const fiatPrice = Number(price) * Number(value)
  return (
     <div className="bg-background-2 p-4 rounded-border-radius-large">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <Input
            value={value}
            onChange={onChange}
            variant="unstyled"
            placeholder="0"
            containerClassName="px-0"
            className="text-font-size-300"
          />
          <p className="text-text-subtle">${formatNumberBro(fiatPrice, 4) }</p>
        </div>

        <div className="flex flex-col gap-y-space-100">
          <div className="flex items-center gap-x-space-100">
            <div className="relative w-8 h-8 rounded-full flex items-center justify-center">
              <Image width={32} height={32} src={get(token, 'image', '_')} alt="token" className="rounded-full" />
            </div>
            <p className="uppercase">{get(token, 'symbol')}</p>
          </div>
          <div className="uppercase text-font-size-175 text-text-subtle text-right">{formatNumberBro(get(token, 'balance', '0'), 4)} {get(token, 'symbol')}</div>

        </div>
      </div>
    </div>
  );
}
 
export default TokenInput;