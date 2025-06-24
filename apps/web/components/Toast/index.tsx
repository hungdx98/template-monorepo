'use client'

import cx from '@/utils/styled'
import { cva, type VariantProps } from 'class-variance-authority'
import { FC, useEffect, useState } from 'react'
import { toast as toastSooner } from 'sonner'
import { Icon, IconType } from '../Icon'
import Loading from '../Loading'
import { Progress } from '../Progress'

const toastVariants = cva(
  'group bg-toast-fill min-w-space-3750 pointer-events-auto relative flex w-full items-center justify-between overflow-hidden rounded-md border p-space-150 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: '',
        success: '',
        error: '',
        loading: '',
        progress: ''
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const progressVariants = cva('', {
  variants: {
    variant: {
      loading: '',
      default: 'text-icon-subtle',
      success: 'text-icon-success',
      error: 'text-icon-error',
      progress: ''
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

interface ToastProps extends VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  action?: {
    label: string
    icon?: IconType
    onClick: () => void
  }
  progress?: number
  className?: string
}

const CustomToast: FC<ToastProps & { t: string | number }> = ({
  variant = 'default',
  title,
  description,
  action = {
    label: '',
    icon: '',
    onClick: () => {}
  },
  className,
  progress = 0,
  t,
  ...props
}) => {
  const [value, setValue] = useState(progress)

  const variantIcon = {
    default: 'icon-app_status_info',
    success: 'icon-app_status_checked',
    error: 'icon-app_status_declined',
    loading: '',
    progress: ''
  }[variant || 'default'] as IconType

  useEffect(() => {
    if (progress >= 100) {
      toastSooner.dismiss(t)
    }

    setValue(progress)
  }, [progress, t])

  return (
    <div className={cx(toastVariants({ variant }), className)} {...props}>
      <div className="flex gap-space-150 w-full items-center">
        {variant !== 'progress' &&
          (variant === 'loading' ? (
            <Loading className="h-space-300 gap-space-300 mr-0" />
          ) : (
            <Icon
              name={variantIcon}
              className={cx(
                'text-font-size-300',
                progressVariants({ variant })
              )}
            />
          ))}

        <div className="flex flex-col gap-space-050 w-full">
          {title && <h3 className="custom-text-medium">{title}</h3>}
          {description && (
            <p className="custom-text-xsmall text-text-subtle line-clamp-2">
              {description}
            </p>
          )}
          {action?.label && (
            <div
              className="cursor-pointer custom-text-small-strong text-text-brand whitespace-nowrap"
              onClick={action.onClick}>
              {action?.label}
              {action?.icon && <Icon name={action.icon} />}
            </div>
          )}

          {variant === 'progress' && (
            <div className="mt-space-100 w-full">
              <Progress value={value} className="w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const toast = ({ variant, progress = 0, ...props }: ToastProps) => {
  return toastSooner.custom(
    (t) => {
      return (
        <CustomToast {...props} variant={variant} progress={progress} t={t} />
      )
    },
    {
      duration:
        variant === 'progress'
          ? progress >= 100
            ? 0
            : Infinity
          : variant === 'loading'
          ? Infinity
          : 5000
    }
  )
}
