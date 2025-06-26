'use client'
import { useTranslations } from 'next-intl'
import Chip from '../Chip'

export const DAY_OPTIONS = [7, 30, 90, 180]

interface DayOptionsProps {
  value: number
  onChange: (day: number) => void
}
const DayOptions = ({ value, onChange }: DayOptionsProps) => {
  const t = useTranslations('PoolPage')

  const renderTvlDay = (day: number) => {
    const isActive = value === day
    const handleSetDay = () => {
      onChange(day)
    }

    return (
      <Chip key={`tvl-day-${day}`} onClick={handleSetDay} isActive={isActive}>
        {t('nDay', { time: String(day) })}
      </Chip>
    )
  }

  return (
    <div className="flex items-center gap-space-100">
      {DAY_OPTIONS.map(renderTvlDay)}
    </div>
  )
}

export default DayOptions
