import { formatNumberView } from '@/utils/formatNumberView'
import cx from '@/utils/styled'
import get from 'lodash/get'
import { FC, ReactNode, memo, useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import Button from '../Button'
import { Icon } from '../Icon'
import CustomLabel from './CustomLabel'
import CustomTooltip from './CustomTooltip'
import { getPrice } from '@/utils/getPrice'

type FormatToolTipType = (data: {
  value: number | string
  key: string
}) => string

export type ChartDataType = {
  xAxisKey: string
  overlapKey?: string
  label: Record<string, string>
  colors: Record<string, string>
  data: Record<
    string,
    number | string | boolean | Record<string, string | number>
  >[]
}
interface LiquidityChartProps {
  data: ChartDataType
  className?: string
  wrapperClassName?: string
  width?: number
  height?: number
  title?: string
  enableZoom?: boolean
  theme?: string
  hideLabel?: boolean
  tooltip?: any
  showActiveBinFlag?: boolean
  showYAxis?: boolean
  margin?: {
    top?: number
    right?: number
    left?: number
    bottom?: number
  }
  rightHeader?: ReactNode
  msgEmpty?: string
  view?: 'base' | 'quote'
  formatTooltip?: FormatToolTipType
  formatXAxis?: (value: number) => string
}

const getGradientColor = (id: string, stopColor: string, theme: string) => {
  return (
    <linearGradient
      key={id}
      id={id}
      x1="0"
      y1="0"
      x2="0"
      y2="100%"
      spreadMethod="reflect">
      <stop offset="0" stopColor={stopColor} />
      <stop offset="1" stopColor={theme === 'light' ? '#ffffff' : '#000000'} />
    </linearGradient>
  )
}

const SIZE = 63

const LiquidityChart: FC<LiquidityChartProps> = ({
  data = {
    xAxisKey: '',
    overlapKey: '',
    label: {},
    colors: {},
    data: []
  },
  width = '100%',
  height = 300,
  title,
  className,
  wrapperClassName,
  enableZoom = false,
  theme = 'light',
  hideLabel = false,
  tooltip,
  showActiveBinFlag,
  showYAxis = false,
  margin = {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0
  },
  rightHeader,
  msgEmpty,
  view = 'base',
  formatTooltip,
  formatXAxis
}) => {
  const wrapperRef = useRef(null)
  const fullLength = data.data.length
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [displayedData, setDisplayedData] = useState([
    ...data.data.slice(0, SIZE)
  ])
  const [currentCount, setCurrentCount] = useState(SIZE)

  const renderData = enableZoom ? displayedData : data.data
  const handleShow = (type: number) => () => {
    const newLength = currentCount + SIZE * type
    const newCount =
      type > 0 ? Math.min(newLength, fullLength) : Math.max(newLength, SIZE)

    setDisplayedData([...data.data.slice(0, newCount)])
    setCurrentCount(newCount)
  }

  const handleMouseEnter = (data: any, index: number) => {
    setHoveredBar(index)
  }

  const handleMouseLeave = () => {
    setHoveredBar(null)
  }

  const renderLabels = () => {
    return Object.keys(data.label ?? []).map((key) => {
      return (
        <div key={key} className="flex items-center">
          <span
            style={{
              backgroundColor: get(data, `colors.${key}`, '')
            }}
            className="w-space-100 h-space-100 rounded-full mr-space-100"></span>
          <span className="custom-text-small-strong">{data.label[key]}</span>
        </div>
      )
    })
  }

  const renderColors = () => {
    return Object.keys(data.colors).map((key) => {
      if (data.overlapKey === key) return
      return getGradientColor(
        `color-${key}`,
        get(data, `colors.${key}`, ''),
        theme
      )
    })
  }

  const renderColorsOverlap = () => {
    return Object.keys(data.colors).map((key) => {
      if (data.overlapKey !== key) return
      return getGradientColor(
        `color-${key}`,
        get(data, `colors.${key}`, ''),
        theme
      )
    })
  }

  const formatYAxis = (value: number) => {
    return `$${formatNumberView(value)}`
  }

  const renderChart = () => {
    return Object.keys(data.label).map((key, idx) => {
      if ([data.xAxisKey, data.overlapKey].includes(key)) return

      return (
        <Bar
          key={key}
          dataKey={key}
          stackId="stack"
          radius={[4, 4, 0, 0]}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...(idx === 1 &&
            showActiveBinFlag && {
              label: (props) => <CustomLabel {...props} data={data} />
            })}>
          {renderData.map((entry, index: number) => (
            <Cell
              fill={`url(#color-${key})`}
              key={`cell-${index}`}
              id={
                get(entry, 'isActive')
                  ? 'active-cell'
                  : `inactive-cell-${index}`
              }
              strokeOpacity={
                hoveredBar === index ? 'opacity-50' : 'opacity-100'
              }
              fillOpacity={
                get(entry, 'isActive') ? 0.5 : hoveredBar === index ? 1 : 0.8
              }
            />
          ))}
        </Bar>
      )
    })
  }

  const renderChartOverlap = () => {
    return Object.keys(data.label).map((key) => {
      if (data.overlapKey !== key) return

      return (
        <Bar
          key={key}
          dataKey={key}
          radius={[4, 4, 0, 0]}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          {renderData.map((entry, index: number) => (
            <Cell
              fill={`url(#color-${key})`}
              key={`cell-${index}`}
              strokeOpacity={
                hoveredBar === index ? 'opacity-50' : 'opacity-100'
              }
              fillOpacity={
                get(entry, 'isActive') ? 0.5 : hoveredBar === index ? 1 : 0.8
              }
            />
          ))}
        </Bar>
      )
    })
  }

  const renderTickFormatter = (value: number) => {
    if (typeof formatXAxis === 'function') {
      return formatXAxis(value)
    }

    return getPrice(view, value)
  }

  return (
    <div
      ref={wrapperRef}
      style={{
        width: width
      }}>
      <div
        className={cx(
          'flex flex-col md:flex-row md:items-center',
          wrapperClassName
        )}>
        {title && <p className="custom-text-xlarge-strong">{title}</p>}
        {!hideLabel && (
          <div className="md:ml-auto mt-space-200 md:mt-space-0 flex items-center gap-space-200">
            {renderLabels()}
          </div>
        )}
        {rightHeader && (
          <div className="md:ml-auto mt-space-200 md:mt-space-0 flex items-center gap-space-200">
            {rightHeader}
          </div>
        )}
      </div>
      {data.data.length === 0 ? (
        <div className="flex flex-col mt-space-200 justify-center items-center h-space-3000">
          <Icon
            name="icon-app_logo_saros"
            className="text-font-size-1000 text-icon-disabled"></Icon>
          <p className="text-text-subtle text-center mt-space-200">
            {msgEmpty}
          </p>
        </div>
      ) : (
        <div className="relative">
          <ResponsiveContainer
            width={width}
            height={height}
            style={{ position: 'relative', zIndex: 1 }}>
            <BarChart data={renderData} className={className} margin={margin}>
              <defs>{renderColors()}</defs>
              {renderChart()}
              <XAxis
                dataKey={data.xAxisKey}
                tickLine={false}
                axisLine={{ stroke: 'transparent' }}
                className="custom-text-3xsmall mt-space-400"
                tickFormatter={renderTickFormatter}
              />
              {showYAxis && (
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatYAxis}
                />
              )}
              <Tooltip
                cursor={{ fill: 'transparent' }}
                content={
                  tooltip ? (
                    tooltip
                  ) : (
                    <CustomTooltip
                      xAxisKey={data.xAxisKey}
                      label={data.label}
                      view={view}
                      overlapKey={data.overlapKey}
                      formatTooltip={formatTooltip}
                    />
                  )
                }
              />
            </BarChart>
          </ResponsiveContainer>
          {data.overlapKey && (
            <ResponsiveContainer
              width={width}
              height={height}
              style={{ position: 'absolute', top: 0, left: 0 }}>
              <BarChart data={renderData} className={className} margin={margin}>
                <defs>{renderColorsOverlap()}</defs>
                {renderChartOverlap()}
                <XAxis
                  dataKey={data.xAxisKey}
                  tickLine={false}
                  axisLine={{ stroke: 'transparent' }}
                  className="custom-text-3xsmall mt-space-400"
                  hide
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={
                    <CustomTooltip
                      xAxisKey={data.xAxisKey}
                      label={data.label}
                      formatTooltip={formatTooltip}
                    />
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          )}

          {SIZE < fullLength && enableZoom && (
            <div className="flex items-center gap-space-100 absolute right-space-200 bottom-space-400 z-10">
              <Button
                className="w-space-400 h-space-400 bg-background-1"
                size="md"
                variant="secondary"
                disabled={currentCount <= SIZE}
                onClick={handleShow(-1)}>
                <Icon name="icon-app_minus" className="text-font-size-250" />
              </Button>
              <Button
                className="w-space-400 h-space-400 bg-background-1"
                size="md"
                variant="secondary"
                disabled={currentCount >= fullLength}
                onClick={handleShow(1)}>
                <Icon name="icon-app_add" className="text-font-size-250" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const areEqual = (
  prevProps: LiquidityChartProps,
  nextProps: LiquidityChartProps
) => {
  return (
    JSON.stringify(prevProps.data.data) ===
      JSON.stringify(nextProps.data.data) &&
    prevProps.theme === nextProps.theme &&
    prevProps.view === nextProps.view
  )
}

export default memo(LiquidityChart, areEqual)
