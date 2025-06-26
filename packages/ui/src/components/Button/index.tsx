import { cx } from '@repo/tailwind-config'
import React, { ButtonHTMLAttributes } from 'react'
import Loading from '../Loading'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  className?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  leftIcon,
  rightIcon,
  disabled,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'font-medium rounded-border-radius-large transition-colors inline-flex items-center justify-center outline-2 outline-offset-2 outline-transparent cursor-pointer relative leading-tight transition-all duration-200 text-base text-white  px-space-250 py-space-150 justify-center items-center gap-space-100 flex w-full'

  const variantStyles = {
    primary: 'bg-button-pri-fill',
    secondary:
      'bg-button-sec-fill text-button-sec-text hover:bg-button-sec-hover'
  }

  const sizeStyles = {
    sm: 'text-sm px-space-150 py-space-075',
    md: 'text-base px-space-200 py-space-100 h-space-500',
    lg: 'text-lg px-space-300 py-space-150 h-space-700 rounded-border-radius-huge'
  }

  const disabledStyles =
    disabled || isLoading
      ? 'cursor-not-allowed pointer-events-none text-text-disabled bg-button-disabled-fill '
      : ''

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabledStyles,
        className,
      )}
      {...props}>
      {leftIcon && !isLoading && <span className="">{leftIcon}</span>}
      {isLoading && <Loading />}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  )
}
