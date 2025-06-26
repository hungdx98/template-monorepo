'use client'

import cx from '@/utils/styled'
import React, { ReactNode, useEffect, useState } from 'react'

interface InputGroupProps {
  children?: ReactNode
  label?: string | ReactNode
  logoLabel?: ReactNode
  labelClassName?: string
  errorMessage?: string
  customMessage?: ReactNode
  id?: string
  isRequired?: boolean
  className?: string
  inputValue?: string
  isDisable?: boolean
  labelRight?: ReactNode
}

export const InputGroup = ({
  id,
  label,
  logoLabel,
  labelClassName,
  errorMessage,
  customMessage,
  isRequired = false,
  children,
  className,
  inputValue,
  isDisable,
  labelRight
}: InputGroupProps) => {
  const [isTouched, setIsTouched] = useState(false)

  const isShowError =
    typeof inputValue === 'string'
      ? Boolean(isTouched && errorMessage)
      : Boolean(errorMessage)

  useEffect(() => {
    if (inputValue) {
      setIsTouched(true)
    }
  }, [inputValue])

  return (
    <div
      className={cx(
        'flex flex-col w-full rounded-xl gap-space-075 relative',
        {
          'opacity-30 pointer-events-none cursor-not-allowed': isDisable, 
        },
        className
      )}>
      <div className="flex flex-col md:flex-row md:items-center gap-space-075">
        {logoLabel && <div>{logoLabel}</div>}
        {label && (
          <label
            htmlFor={id}
            className={cx(
              'inline-block custom-text-small-strong text-input-field-text-label',
              labelClassName
            )}>
            {label}
            {isRequired && (
              <sup className="ml-space-050 text-sematic-warning">*</sup>
            )}
          </label>
        )}
        {labelRight && (
          <div className="flex items-center md:ml-auto">{labelRight}</div>
        )}
      </div>
      <div>{children}</div>
      {customMessage}
      {isShowError && (
        <span className="block custom-text-small-strong text-text-sematic-warning absolute top-full">
          {errorMessage}
        </span>
      )}
    </div>
  )
}
