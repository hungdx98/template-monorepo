import { IconClassList } from '@/constants/icons'
import cx from '@/utils/styled'
import React from 'react'

export type IconType = (typeof IconClassList)[number]

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: (typeof IconClassList)[number]
}

export const Icon: React.FC<IconProps> = ({ name, className, ...rest }) => {
  return (
    <span className={cx(name, '!leading-none', className)} {...rest}></span>
  )
}
