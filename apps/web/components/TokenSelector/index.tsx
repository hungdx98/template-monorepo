import Image from 'next/image'
import { Icon } from '../Icon'
// import { TokenSelectorModal } from './TokenSelectorModal'
import { Token, TokenSelectorModalProps } from './type'
import { useTranslations } from 'next-intl'
import cx from '@/utils/styled'
import get from 'lodash/get'
import { memo } from 'react'
import Button from '../Button'
import SelectTokenModal from '@/views/CreatePositionScreen/components/SelectTokenModal'

interface Props
  extends Pick<TokenSelectorModalProps, 'hideTab' | 'hideSearch' | 'tokens'> {
  onSelectedToken?: (token: Token) => void
  selectedToken?: Token | undefined
  className?: string
  size?: number
  showName?: boolean
  iconClassName?: string
  page?: string
  tokens: Token[]
}

export const TokenSelector = (props: Props) => {
  const t = useTranslations()
  const { selectedToken = undefined, onSelectedToken = () => {}, tokens } = props

  const onOpenModal = () => {
    window.openModal({
      title: t('select_token'),
      size: 'sm',
      content: <SelectTokenModal listToken={tokens} onSelectToken={onSelectedToken}/>,
      onClose: () => {
        console.log("Modal closed");
      }
    })
  }

  return (
    <div className='w-full'>
      <Button
        onClick={onOpenModal}
        type="button"
        className={cx(
          'w-full box-border break-words font-inherit m-0 overflow-visible normal-case p-0 inline-flex appearance-none items-center justify-center select-none relative whitespace-nowrap align-middle outline-2 outline-transparent outline-offset-2 leading-[1.2] font-normal transition min-w-[3rem] text-sm text-text bg-button-sec-text rounded-border-radius-large shrink-0 px-space-200 cursor-pointer h-12 gap-2',
          {
            'bg-background-2-active': selectedToken
          },
          props.className
        )}>
        <div className="w-full flex items-center justify-between">
          {selectedToken ? (
            <div className="flex items-center w-full">
              {get(selectedToken, 'image') ? (
                <Image
                  src={get(selectedToken, 'image', '')}
                  alt={get(selectedToken, 'symbol')}
                  width={props.size || 24}
                  height={props.size || 24}
                  className="rounded-full"
                />
              ) : (
                <Icon
                  name="app_validator"
                  className="text-font-size-200"
                />
              )}

              <span className="custom-text-small ml-space-150 uppercase">
                {get(selectedToken, 'symbol', '')}
              </span>

              {props.showName && (
                <span className="custom-text-large ml-space-150 text-text-subtlest">
                  {get(selectedToken, 'name', '')}
                </span>
              )}
            </div>
          ) : (
            <div className="flex justify-start w-full custom-text-large text-text-subtlest">
              {t('select_token')}
            </div>
          )}
          <Icon
            name="app_chevron_down"
            className={cx(
              'ml-space-150 text-font-size-200',
              {
                'text-text-subtlest': !selectedToken,
                'button-sec-text': selectedToken,
              },
              props.iconClassName
            )}
          />
        </div>
      </Button>
    </div>
    
  )
}

export default memo(TokenSelector)
