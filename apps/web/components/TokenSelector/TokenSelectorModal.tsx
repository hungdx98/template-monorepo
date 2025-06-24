import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/Modal'
import { useGetOwnerTokens } from '@/hooks/queries/useGetOwnerTokens'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import cx from '@/utils/styled'
import compact from 'lodash/compact'
import { useTranslations } from 'next-intl'
import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import { Icon } from '../Icon'
import { Input } from '../Input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs'
import { TabContent, TabContentProps } from './TabContent'
import { TokenSelectorModalProps } from './type'
import { createPortal } from 'react-dom'

type ITabData = {
  key: 'all' | 'yourTokens' | 'importedTokens'
  Component: FC<TabContentProps>
}

const TAB_DATA: ITabData[] = [
  {
    key: 'all',
    Component: TabContent
  },
  {
    key: 'yourTokens',
    Component: TabContent
  },
  {
    key: 'importedTokens',
    Component: TabContent
  }
] as const

const TokenSelectorModalComponent: React.FC<
  React.PropsWithChildren<TokenSelectorModalProps>
> = ({ onSelect = () => {}, children, tokens, hideTab, hideSearch, page }) => {
  const t = useTranslations('tokens')
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [keyword, setKeyword] = useState<string>('')
  const [keySearch, setKeySearch] = useState<string>('')
  const debounceKeySearch = useDebouncedValue(keySearch, 300)
  const { data: yourTokens, refetch } = useGetOwnerTokens()

  const tokensWBalance = tokens

  useEffect(() => {
    if (modalOpen) {
      refetch()
    }
  }, [refetch, modalOpen])

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setKeySearch(e.target.value)
  }

  const handleClearKeySearch = () => {
    setKeySearch('')
  }

  const renderTabList = (item: ITabData) => {
    const { key } = item
    return (
      <TabsTrigger key={`tab-list-${key}`} value={key} className="pb-space-100">
        {t(key)}
      </TabsTrigger>
    )
  }

  const onToggleModal = (isOpen: boolean) => {
    if (!isOpen) {
      setKeySearch('')
      setKeyword('')
    }
    setModalOpen(isOpen)
  }

  const renderTabContent = (item: ITabData) => {
    const { Component, key } = item
    const list = key === 'yourTokens' ? compact(yourTokens) : tokens

    return (
      <TabsContent key={`tab-content-${key}`} value={key}>
        <Component
          type={key}
          keyword={keyword}
          setModalOpen={setModalOpen}
          onSelect={onSelect}
          tokens={list}
          page={page}
        />
      </TabsContent>
    )
  }

  useEffect(() => {
    setKeyword(debounceKeySearch)
  }, [debounceKeySearch])

  return (
    <Dialog open={modalOpen} onOpenChange={onToggleModal}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      {createPortal(
        <DialogContent className="sm:max-w-space-7100 p-0">
          <DialogHeader className="bg-background-app w-full rounded-2xl shadow-lg gap-0">
            <DialogTitle className="p-space-150 md:p-space-250 flex items-center justify-between">
              <span className="custom-text-title-medium text-tezt">
                {t('selectToken')}
              </span>

              <DialogClose asChild>
                <Icon
                  name="icon-app_close"
                  className="!text-font-size-300 text-text-subtle cursor-pointer"
                />
              </DialogClose>
            </DialogTitle>

            <div className="pb-space-150 md:pb-space-250">
              {!hideSearch && (
                <div className="px-space-150 md:px-space-250">
                  <Input
                    placeholder="Search token or address"
                    containerClassName="min-w-size-4000 bg-background-alpha mb-space-300"
                    suffixIcon={
                      <div
                        className={cx(
                          'h-size-300 overflow-hidden',
                          keySearch && 'cursor-pointer'
                        )}
                        onClick={handleClearKeySearch}>
                        <Icon
                          name={
                            keySearch ? 'icon-app_close' : 'icon-app_search'
                          }
                          className="text-font-size-300"></Icon>
                      </div>
                    }
                    value={keySearch}
                    onChange={onSearch}
                  />
                </div>
              )}

              {!hideTab ? (
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="mt-space-150"
                  defaultValue="all">
                  <TabsList className="px-space-150 md:px-space-250">
                    {TAB_DATA.map(renderTabList)}
                  </TabsList>

                  {TAB_DATA.map(renderTabContent)}
                </Tabs>
              ) : (
                <TabContent
                  type="all"
                  keyword={keyword}
                  setModalOpen={setModalOpen}
                  onSelect={onSelect}
                  tokens={tokensWBalance}
                  page={page}
                />
              )}
            </div>
          </DialogHeader>
        </DialogContent>,
        document.body
      )}
    </Dialog>
  )
}

export const TokenSelectorModal = React.memo(TokenSelectorModalComponent)
