import { useFetchMultipleTokenPrice } from '@/hooks/queries/useFetchTokenPrice'
import { formatNumberBro } from '@/utils'
import cx from '@/utils/styled'
import truncateAddress from '@/utils/truncateAddress'
import get from 'lodash/get'
import Image from 'next/image'
import React from 'react'
import { Icon } from '../Icon'
import { Token } from './type'

interface TokenListItemProps {
  index: number
  token: Token
  onSelect: () => void
}

// eslint-disable-next-line react/display-name
export const TokenListItem = React.memo(({
  index,
  token,
  onSelect
}: TokenListItemProps) => {
  const queries = useFetchMultipleTokenPrice([token!])
  const [currentPrice = 0] = queries.map((query) => query.data)

  const tokenAddress =
    get(token, 'anotherAddress') || get(token, 'address', null)
  const tokenBalance = get(token, 'balance', 0)
  return (
    <div
      key={get(token, 'address', 'solana') + get(token, 'name', 'SOL') + index}
      onClick={onSelect}
      className={cx(
        'flex items-center justify-between py-space-150 px-space-150 md:px-space-250 rounded-md cursor-pointer hover:bg-background-3',
        tokenBalance > 0 ? 'order-1' : 'order-2'
      )}>
      <div className="flex items-center gap-space-100">
        {get(token, 'image') ? (
          <Image
            src={get(token, 'image')}
            alt={get(token, 'symbol', `token-${index}`)}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <Icon name="icon-app_validator" className="text-font-size-500" />
        )}

        <div className="flex flex-col items-start">
          <div className="flex flex-col md:flex-row items-start custom-text-large">
            <span className="uppercase">{get(token, 'symbol')}</span>
            <span className="text-text-subtle md:ml-space-100 line-clamp-1 text-left">
              {get(token, 'name')}
            </span>
          </div>
          {tokenAddress && (
            <div className="custom-text-small text-text-subtle">
              {truncateAddress(tokenAddress)}
            </div>
          )}
        </div>
      </div>
      {tokenBalance > 0 && (
        <div className="flex flex-col items-end">
          <div className="custom-text-large">
            {formatNumberBro(tokenBalance)}
          </div>
          <div className="custom-text-small text-text-subtle">
            ${formatNumberBro(tokenBalance * +currentPrice)}
          </div>
        </div>
      )}
    </div>
  )
}
)