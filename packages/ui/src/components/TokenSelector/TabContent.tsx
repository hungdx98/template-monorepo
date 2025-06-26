import { useGetTokenInfo } from '@/hooks/queries/useGetTokenInfo'
import { useGetTokenList } from '@/hooks/queries/useGetTokenList'
import { getUniqueToken } from '@/utils/getUniqueToken'
import uniqBy from 'lodash/uniqBy'
import { useTranslations } from 'next-intl'
import { FC, useCallback, useMemo } from 'react'
// @ts-expect-error abc
import { FixedSizeList } from 'react-window'
import { Icon } from '../Icon'
import { TokenListItem } from './TokenListItem'
import { Token } from './type'
import Loading from '../Loading'

export interface TabContentProps {
  keyword?: string
  type?: 'all' | 'yourTokens' | 'importedTokens'
  onSelect: (token: Token) => void
  setModalOpen: (open: boolean) => void
  tokens?: Token[]
  page?: string
}

export const TabContent: FC<TabContentProps> = ({
  keyword = '',
  type = '',
  tokens = [],
  page,
  onSelect,
  setModalOpen
}) => {
  const t = useTranslations('tokens')
  const { data } = useGetTokenList(tokens || [], type, page || '', keyword)
  const { data: customToken, isFetching } = useGetTokenInfo(
    // @ts-expect-error abc
    {
      address: keyword!
    }
  )

  const handleSelect = useCallback(
    (token: Token) => () => {
      onSelect(token)
      setModalOpen(false)
    },
    []
  )

  const renderList = useMemo(() => {
    const filtered = keyword ? data : tokens

    const listRender =
      type === 'all'
        ? filtered || []
        : filtered?.filter((it) => it?.balance) || []

    if (customToken) {
      listRender.push(customToken)
    }

    if (!listRender?.length) {
      return (
        <div className="flex h-size-3200 justify-center flex-col items-center">
          <Icon
            name="icon-app_add"
            className="text-font-size-600 text-text-subtlest mb-space-200"
          />
          <p className="text-text-subtlest custom-text-medium mb-space-100">
            {t('noTokensFound')}
          </p>
          {keyword && (
            <p className="text-text-subtle custom-text-small">
              {t('tryAdjusting')}
            </p>
          )}
        </div>
      )
    }
    const uniqData = uniqBy(listRender, (item) => item?.address) as Token[]

    const Row = ({ index, style }: any) => {
      const token = uniqData[index]

      if (!token) {
        return null
      }
      return (
        <div
          key={`list-item-${getUniqueToken(token, index)}-${type}`}
          style={style}
          className="list-item">
          <TokenListItem
            index={index}
            onSelect={handleSelect(token)}
            token={token}
          />
        </div>
      )
    }

    return (
      <FixedSizeList
        height={560}
        width="100%"
        itemCount={uniqData.length}
        itemSize={64}>
        {Row}
      </FixedSizeList>
    )
  }, [data, customToken, keyword, type, handleSelect, tokens])

  return (
    <div className="max-h-space-5000 h-space-5000 md:max-h-space-7100 md:h-space-7100 overflow-y-auto no-scrollbar">
      {isFetching ? (
        <div className="flex h-full items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col">{renderList}</div>
      )}
    </div>
  )
}
