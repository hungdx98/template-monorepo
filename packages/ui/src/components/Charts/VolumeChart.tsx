'use client'
import { formatNumberBro } from '@/utils'
import cx from '@/utils/styled'
import get from 'lodash/get'
import moment from 'moment'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import DayOptions, { DAY_OPTIONS } from './DayOptions'

interface VolumeChartProps {
  data: any
  color?: string
  title?: string
  keyValue: string
  tooltip?: any
  filterDay?: number
  className?: string
  margin?: {
    top?: number
    right?: number
    left?: number
    bottom?: number
  }
  formatXAxisLabel?: (value: number) => string
  formatYAxisLabel?: (value: number) => string
  setFilterDay?: (day: number) => void
}

export const getTime = (timestamp: number) => {
  const time = moment(timestamp * 1000)
  const hour12 = time.format('h')
  const ampm = time.format('A')
  return `${hour12.length >= 2 ? '' : '0'}${hour12}:00 ${ampm}`
}

export const VolumeChart = ({
  data,
  keyValue,
  title,
  color = '#2CBA51',
  tooltip,
  filterDay = DAY_OPTIONS[0],
  className,
  margin = {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0
  },
  formatXAxisLabel,
  formatYAxisLabel,
  setFilterDay = () => {}
}: VolumeChartProps) => {
  const colorId = color.replace('#', '')

  const formatYAxis = (value: number) => {
    if (typeof formatYAxisLabel === 'function') {
      return formatYAxisLabel(value)
    }

    return `$${formatNumberBro(value, 2)}`
  }

  const formatXAxis = (value: number) => {
    if (typeof formatXAxisLabel === 'function') {
      return formatXAxisLabel(value)
    }

    return value.toString()
  }

  return (
    <div className={cx('mt-space-500', className)}>
      <div className="flex flex-col md:flex-row md:items-center mb-space-500">
        {title && (
          <p className="custom-text-large-strong mb-space-100">{title}</p>
        )}

        <div className="md:ml-auto">
          <DayOptions value={filterDay} onChange={setFilterDay} />
        </div>
      </div>
      <div className="h-space-3000">
        <ResponsiveContainer>
          <AreaChart data={data} margin={margin}>
            <defs>
              <linearGradient
                id={colorId}
                x1="330"
                y1="0"
                x2="330"
                y2="200"
                gradientUnits="userSpaceOnUse">
                <stop stopColor={color} stopOpacity="0.4" />
                <stop offset="1" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <defs>
              <linearGradient
                id={`stroke-${colorId}`}
                x1="1"
                y1="95"
                x2="661"
                y2="95"
                gradientUnits="userSpaceOnUse">
                <stop offset="0.32" stopColor={color} stopOpacity="0" />
                <stop offset="1" stopColor={color} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: 'transparent' }}
              className="custom-text-3xsmall mt-space-400"
              tickFormatter={formatXAxis}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
            />

            <Area
              type="monotone"
              dataKey={keyValue}
              fillOpacity={1}
              stroke={`url(#stroke-${colorId})`}
              fill={`url(#${colorId})`}
            />

            <Tooltip
              content={(params) => {
                if (tooltip) {
                  return tooltip(params)
                }

                const { active, payload } = params

                if (active) {
                  return (
                    <div className="bg-background-3 rounded-2xl p-space-200">
                      <p className="text-text-subtle">
                        {moment(get(payload, [0, 'payload', 'date'])).format(
                          'MMM DD, YYYY'
                        )}
                      </p>
                      <p className="text-text custom-text-medium-strong mt-space-100">
                        $
                        {formatNumberBro(get(payload, [0, 'payload', 'value']))}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
