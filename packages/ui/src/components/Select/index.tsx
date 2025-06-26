'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/DropdownMenu'
import { Icon } from '@/components/Icon'
import cx from '@/utils/styled'
import { FC, ReactNode, useState } from 'react'

interface SelectProps {
  value?: string
  options: {
    key: string
    label: string
  }[]
  className?: string
  onChange?: (val: string) => void
  renderItem?: (item: { key: string; label: string }) => ReactNode
}

export const Select: FC<SelectProps> = ({
  options = [],
  value,
  className,
  onChange = () => {},
  renderItem
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const handleChangeDropDown = (val: boolean) => {
    setModalOpen(val)
  }

  const handleSortingItem = (key: string) => () => {
    if (key === value) {
      return
    }

    setModalOpen(false)
    onChange(key)
  }

  const renderSelected = () => {
    const item = options.find((item) => item.key === value) || options[0]
    if (typeof renderItem === 'function') {
      return renderItem(item)
    }
    return item.label
  }

  const renderOptions = () => {
    return options.map((item, index) => {
      return (
        <div
          key={index}
          onClick={handleSortingItem(
            item.key.replace('-', '').replace('+', '')
          )}
          className={cx(
            'px-space-200 py-space-100 hover:bg-background-1-active',
            {
              'cursor-pointer': item.key !== value
            }
          )}>
          {item.label}
        </div>
      )
    })
  }

  return (
    <DropdownMenu open={modalOpen} onOpenChange={handleChangeDropDown}>
      <DropdownMenuTrigger className="center-flex gap-2 cursor-pointer w-full">
        <div className={cx("h-space-500 px-space-150 border-1 border-border rounded-md flex items-center grow", className)}>
          {renderSelected()}
          <Icon
            name="icon-app_chevron_down"
            className="ml-auto text-font-size-200"></Icon>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={10}
        className="rounded-sm bg-toast-fill shadow-xl py-space-100 w-(--radix-dropdown-menu-trigger-width) px-0">
        <>{renderOptions()}</>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
