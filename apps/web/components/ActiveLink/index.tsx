'use client'
import cx from '@/utils/styled'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

interface ActiveLinkProps extends LinkProps {
  className?: string
}

export const ActiveLink = ({
  children,
  className,
  ...props
}: React.PropsWithChildren<ActiveLinkProps>) => {
  const pathname = usePathname()
  const isActive = useMemo(() => {
    if (typeof props.href === 'string') {
      return pathname.includes(props.href)
    }
    return props.href.pathname && pathname.includes(props.href.pathname)
  }, [pathname, props.href])

  return (
    <Link
      {...props}
      className={cx(
        'custom-text-xlarge-strong text-text-subtle',
        {
          'text-text-brand': isActive
        },
        className
      )}>
      {children}
    </Link>
  )
}
