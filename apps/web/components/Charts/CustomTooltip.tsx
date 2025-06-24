import { formatNumberBro } from '@/utils'
import { getPrice } from '@/utils/getPrice'
import get from 'lodash/get'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import {
  NameType,
  ValueType
} from 'recharts/types/component/DefaultTooltipContent'
import { ContentType, TooltipProps } from 'recharts/types/component/Tooltip'

type FormatToolTipType = (data: {
  value: number | string
  key: string
}) => string

export interface ITooltipProps extends TooltipProps<ValueType, NameType> {
  xAxisKey?: string
  overlapKey?: string
  view?: 'base' | 'quote'
  formatTooltip?: FormatToolTipType
  content?: ContentType<ValueType, NameType> & {
    props: {
      label?: Record<string, string>
      xAxisKey?: string
      overlapKey?: string
      view?: 'base' | 'quote'
      formatTooltip?: FormatToolTipType
    }
  }
}

const CustomTooltip: FC<ITooltipProps> = ({ active, payload, content }) => {
  const label = get(content, 'props.label', { tokenY: '', tokenX: '' })
  const xAxisKey = get(content, 'props.xAxisKey', '')
  const overlapKey = get(content, 'props.overlapKey', '')
  const view = get(content, 'props.view', 'base')
  const t = useTranslations('PoolPage')

  if (active && payload && payload.length) {
    const payloadData = payload?.[0].payload

    const renderValue = (key: string) => {
      if (typeof content?.props.formatTooltip === 'function') {
        return content?.props.formatTooltip({
          value: get(payloadData, key, 0),
          key: key
        })
      }

      return formatNumberBro(Number(get(payloadData, key, 0)))
    }

    const renderTooltipContent = () => {
      return Object.keys(payloadData).map((key) => {
        if (
          key === xAxisKey ||
          key === overlapKey ||
          !get(payloadData, key) ||
          !get(label, key)
        )
          return null
        return (
          <div
            key={key}
            className="text-text-subtle custom-text-2xsmall-strong gap-space-100 mt-space-200">
            {get(label, key, '')}
            <p className="text-text custom-text-large-strong">
              {renderValue(key)}
            </p>
          </div>
        )
      })
    }

    const title =
      view === 'base'
        ? `${label.tokenY}/${label.tokenX}`
        : `${label.tokenX}/${label.tokenY}`

    return (
      <div className="rounded bg-background-3 px-space-250 py-space-200 shadow-xl">
        <div className="text-text-subtle custom-text-2xsmall-strong gap-space-100">
          {t('price')} ({title})
          <p className="text-text custom-text-medium-strong">
            {getPrice(view, get(payloadData, xAxisKey, 0))}
          </p>
        </div>

        {renderTooltipContent()}
      </div>
    )
  }
  return null
}

export default CustomTooltip
