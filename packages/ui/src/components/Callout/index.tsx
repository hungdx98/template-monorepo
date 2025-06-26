'use client'
import { Alert, AlertDescription, AlertTitle } from '../Alert'
import { cx } from '@repo/tailwind-config'
import { useMemo } from 'react'
import { Icon } from '../Icon'
import React from 'react'

interface CalloutProps {
  variant?: 'neutral' | 'informative' | 'warning' | 'error'
  contentClassName?: string
  iconClassName?: string
  right?: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export const Callout = ({
  title,
  description,
  right,
  contentClassName,
  variant,
  className,
  ...props
}: React.PropsWithChildren<CalloutProps>) => {
  const iconClassName = useMemo(
    () =>
      cx({
        neutral: 'text-icon-subtle',
        informative: 'text-icon-information',
        warning: 'text-icon-warning',
        error: 'text-icon-error'
      }[variant || 'neutral'] as IconType, props?.iconClassName),
    [variant]
  )

  const variantIcon = useMemo(
    () =>
    ({
      neutral: 'icon-app_warning',
      informative: 'icon-app_warning',
      warning: 'icon-app_status_warning',
      error: 'icon-app_status_warning'
    }[variant || 'neutral'] as IconType),
    [variant]
  )

  return (
    <Alert variant={variant} className={cx(className)} {...props}>
      <Icon name={variantIcon} className={iconClassName} />
      <div className={contentClassName}>
        {title && (
          <AlertTitle className="custom-text-medium-strong">{title}</AlertTitle>
        )}
        {description && (
          <AlertDescription className="custom-text-small">
            {description}
          </AlertDescription>
        )}
      </div>
      {right}
    </Alert>
  )
}

export default Callout
