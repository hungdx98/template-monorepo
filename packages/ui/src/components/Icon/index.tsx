// import { IconClassList } from '@/constants/icons'
import cx from 'classnames'
import React from 'react'

// export type IconType = (typeof IconClassList)[number]

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  // name: (typeof IconClassList)[number]
  name: any
}

export const Icon: React.FC<IconProps> = ({ name, className, ...rest }) => {
  return (
    <span className={cx(`icon-${name}`, '!leading-none', className)} {...rest}></span>
  )
}
