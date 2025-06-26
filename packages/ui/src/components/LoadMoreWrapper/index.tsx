'use client'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import {
  Fragment,
  FunctionComponent,
  useLayoutEffect,
  PropsWithChildren
} from 'react'

interface ArgsObserver extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export interface ILoadMoreWrapperProps {
  loading?: boolean
  disabled?: boolean
  onLoadMore?: () => void
  Args?: ArgsObserver
}

export const LoadMoreWrapper: FunctionComponent<
  PropsWithChildren<ILoadMoreWrapperProps>
> = ({
  children,
  loading = false,
  disabled = false,
  onLoadMore = () => null,
  Args = {}
}) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    ...Args
  })

  useLayoutEffect(() => {
    if (loading || disabled) return

    const handleLoadMore = () => {
      if (onLoadMore && typeof onLoadMore === 'function') {
        onLoadMore()
      }
    }

    if (isIntersecting) {
      handleLoadMore()
    }
  }, [loading, disabled, isIntersecting, onLoadMore])

  return (
    <Fragment>
      {children}

      {!(disabled || loading) && <div ref={ref} />}
    </Fragment>
  )
}
