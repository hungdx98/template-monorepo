import React, { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import get from 'lodash/get'
import { useTranslations } from 'next-intl'
import { Icon } from '../Icon'
import cx from '@/utils/styled'
import classNames from 'classnames'
import Link from 'next/link'
interface IDropdownMenuProps {
  title?: string
  align?: 'center' | 'left' | 'right'
  className?: string
  menuList?: {
    href: string
    label: string
    onClick?: () => void
    customRender?: React.ReactNode | undefined
  }[]
}

const DEFAULT_MENU_LIST = [
  {
    label: 'Menu Item 1',
    onClick: () => console.log('Menu Item 1 clicked'),
    customRender: undefined,
    href: '#'
  }
]
const DropdownMenu = (props:IDropdownMenuProps) => {

  const { title = 'dropdown', 
    className,
    menuList = DEFAULT_MENU_LIST,
    align = 'center'
  } = props
  const [isOpen, setIsOpen] = useState(false)

 
  return (
    <div
      onMouseEnter={() => setIsOpen(true)} 
      onMouseLeave={() => setIsOpen(false)}

      className={cx('flex items-center gap-3 cursor-pointer', className)}>
      <Menu as="div" className="relative inline-block ">
        <div className='flex items-center gap-1 rounded-lg bg-bg-mid p-2 h-11'>
          <Icon name='custom' className='text-xl'/>
          <span className={cx('whitespace-nowrap', {})}>
            {title}
          </span>
          {/* <Menu.Button className="rounded-lg bg-bg-mid px-3 py-2 h-11 all-center">
            <Icon className='text-2xl' name='more' />
          </Menu.Button> */}
        </div>

       
        <Transition
          as={Fragment}
          show={isOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className={cx('absolute  w-56 origin-top-right divide-y divide-gray-100 rounded-border-radius-medium bg-background-app shadow-lg focus:outline-none border border-border-1-subtle', {
            'left-1/2 -translate-x-1/2': align === 'center',
            'left-0': align === 'right',
            'right-0': align === 'left'
          })}>
            <div className="p-2 flex flex-col gap-y-space-100">
              {
                menuList?.map((item) => (
                  <Menu.Item
                    key={get(item, 'label')}
                  >
                    {
                      item?.customRender ??
                      <Link
                        href={get(item, 'href', '#')}
                        onClick={item.onClick}
                        className='flex justify-center cursor-pointer w-full items-center gap-1 bg-background-2 hover:bg-background-2-active p-2 rounded-border-radius-medium border border-border-1-subtle'
                      >
                        <span className='text-text-subtle'>{item.label}</span>
                      </Link>
                    }
                   
                  </Menu.Item>
                )
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>

  )
}

export default DropdownMenu
