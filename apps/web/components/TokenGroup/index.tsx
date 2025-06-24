'use client'

import cx from '@/utils/styled'
import cloneDeep from 'lodash/cloneDeep'
import Image from 'next/image'
import { FunctionComponent } from 'react'
import get from 'lodash/get'
import { Icon } from '../Icon'
import { Token } from '../TokenSelector/type'

export interface TokenGroupProps {
  data?: Token[]
  size?: number
  className?: string
}

const TokenGroup: FunctionComponent<TokenGroupProps> = ({
  className = '',
  data,
  size = 28
}) => {
  const renderAvatarList = () => {
    const tokens = cloneDeep(data) as any[]

    return tokens.map((token: any, index: number) => {
      const tokensProps = {
        alt: token?.symbol || 'lfg logo',
        src:
          token?.image ||
          'https://pbs.twimg.com/profile_images/1742621757230678016/_Av2hYEY_400x400.jpg',
        className: 'relative rounded-full bg-background-app border-background-1 border-2',
        style: {
          zIndex: index
        }
      }

      if (!token?.image) {
        return (
          <div
            key={'token-group-' + get(token, 'address') + index}
            className="w-space-350 h-space-350 relative rounded-full border-background-1 border-2 flex itemx-center justify-center bg-background-mid"
            style={{
              zIndex: index
            }}>
            <Icon name="icon-app_validator" className="text-font-size-300" />
          </div>
        )
      }

      return (
        <Image
          width={size}
          height={size}
          key={'token-group-' + get(token, 'address') + index}
          {...tokensProps}
          alt=""
        />
      )
    })
  }

  return (
    <div className={cx('flex items-center -space-x-2 w-fit flex-none', className)}>
      {renderAvatarList()}
    </div>
  )
}

export default TokenGroup
