import { Badge } from '../Badge'
import { cx } from '@repo/tailwind-config'
import React from 'react'
import { ComponentProps, FC, PropsWithChildren } from 'react'

interface IProps extends ComponentProps<'div'> {
  isActive?: boolean
  variant?: 'border' | 'filled'
  contentClassName?: string
}

const Chip: FC<PropsWithChildren<IProps>> = ({
  children,
  isActive,
  variant = 'border',
  className,
  contentClassName,
  ...props
}) => {
  return (
    <Badge
      {...props}
      className={cx('cursor-pointer', className)}
      variant={'default'}>
      <p className={cx('custom-text-small text-center', contentClassName)}>
        {children}
      </p>
    </Badge>
  )
}

export default Chip
