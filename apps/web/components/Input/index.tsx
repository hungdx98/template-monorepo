"use client"

import cx from '@/utils/styled'
import get from 'lodash/get'
import React from 'react'
import { Icon } from '../Icon'

type InputType = {
  variant?: 'outline' | 'filled' | 'flushed' | 'unstyled'
  colorScheme?: 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'pink'
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
  containerClassName?: string
  isSearch?: boolean
}

const ALLOWED_KEYS = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab']

export const Input: React.FC<React.ComponentProps<'input'> & InputType> = ({
  type = 'text',
  placeholder,
  variant = 'filled',
  colorScheme = 'blue',
  containerClassName,
  className,
  isSearch = false,
  prefixIcon,
  suffixIcon,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'filled':
        return `
          bg-background-2-active border-transparent
          focus:bg-white focus:border-${colorScheme}-500
        `
      case 'flushed':
        return `
          px-0 pb-2 bg-transparent border-b border-input-field-border 
          focus:border-${colorScheme}-500
        `
      case 'unstyled':
        return `
          bg-transparent focus:outline-none border-transparent
        `
      default:
        // outline
        return `
          bg-transparent border-input-field-border
          focus:ring-2 focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500
        `
    }
  }

  const onlyKeydownNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const newValue = Number(
      (get(e, 'target.value', '') + e.key).replace(',', '.')
    )

    // Allow control keys (e.g., Backspace, Arrow keys, Tab, Enter, Ctrl, Alt, etc.)
    if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) {
      return // Allow all control keys and special keys
    }

    if (Number.isNaN(newValue) && !ALLOWED_KEYS.includes(e.key)) {
      e.preventDefault()
      return
    }
  }

  const handleSetNumber = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value
    const newValue = Number(value.replace(',', '.'))
    e.target.value = newValue.toString()
  }

  const typeInputProps = React.useMemo(() => {
    if (type === 'number') {
      return {
        type: 'text',
        onKeyDown: onlyKeydownNumber,
        placeholder: placeholder ?? '0.00',
        onBlur: handleSetNumber,
        maxLength: 40,
      }
    }
    return {
      type
    }
  }, [type])

  return (
    <div
      className={cx(
        `w-full h-12 px-4 py-2 text-base font-normal border border-solid rounded-full focus:outline-none transition duration-150 ease-in-out flex justify-between items-center gap-2`,
        getVariantClasses(),
        containerClassName
      )}>
      {prefixIcon && <div className="flex items-center">{prefixIcon}</div>}
      {isSearch && <div className="flex items-center">
          <Icon name="app_search"/>
        </div>
      }
      <input
        placeholder={placeholder}
        className={cx(
          'w-full bg-transparent outline-none border-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...typeInputProps}
        {...props}
      />
      {suffixIcon && <div className="flex-shrink-0">{suffixIcon}</div>}
    </div>
  )
}
