import get from 'lodash/get'
import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  LanguageCode,
  ResolutionString,
  widget
} from '@public/static/charting_library'
import DataFeed from './TradingView/datafeed'

export const TVChartContainer = (
  props: Partial<ChartingLibraryWidgetOptions>
) => {
  const { theme } = useTheme()
  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null)
  const chartContainerRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLInputElement>

  useEffect(() => {
    if (!props) return

    // localStorage.setItem(get(props, 'address'), JSON.stringify(props.))

    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: get(props, 'symbol'),
      datafeed: new DataFeed(),
      interval: props.interval as ResolutionString,
      container: chartContainerRef.current,
      library_path: props.library_path,
      locale: props.locale as LanguageCode,
      charts_storage_url: props.charts_storage_url,
      charts_storage_api_version: props.charts_storage_api_version,
      client_id: props.client_id,
      user_id: props.user_id,
      fullscreen: props.fullscreen,
      autosize: props.autosize,
      theme: theme === 'dark' ? 'dark' : 'light',
      disabled_features: [
        'use_localstorage_for_settings',
        'header_symbol_search',
        'header_compare',
        'allow_arbitrary_symbol_search_input',
        'header_saveload',
        'legend_inplace_edit',
        'symbol_search_hot_key',
        'symbol_info',
        'show_symbol_logo_in_legend',
        'legend_context_menu'
      ]
    }

    tvWidgetRef.current = new widget(widgetOptions)

    return () => {
      if (!tvWidgetRef.current) return
      // tvWidgetRef.current.remove()
    }
  }, [props, theme])

  return (
    <>
      <div ref={chartContainerRef} className="w-full h-full rounded-lg overflow-hidden " />
    </>
  )
}
