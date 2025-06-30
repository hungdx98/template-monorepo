import { useTranslations } from "next-intl";
import get from "lodash/get";
import { Icon } from "@/components/Icon";
import { Disclosure, Transition } from "@headlessui/react";
import cx from "@/utils/styled";

interface FeeSelectionsProps {
  className?: string;
  isDisplayed?: boolean;
  onChangeFee: (fee: string) => () => void;
  currentFee?: string;
}
const FeeSelections = (props: FeeSelectionsProps) => {

  const { isDisplayed, onChangeFee, currentFee } = props;

  const t = useTranslations();

  const FEE_TIERS_DATA = [
    { value: '0.01', label: t('fee_tier_0_01') },
    { value: '0.05', label: t('fee_tier_0_05') },
    { value: '0.3', label: t('fee_tier_0_3') },
    { value: '1', label: t('fee_tier_1') }
  ]

  return (

    <Disclosure>
      <Transition
        show={isDisplayed}
        enter="transition-[160px] duration-100 ease-linear"
        enterFrom="h-0"
        enterTo="h-[160px]"
        leave={'transition-[160px] duration-150 ease-linear'}
        leaveFrom="h-[160px]"
        leaveTo="h-0"
      >
        <Disclosure.Panel className="overflow-hidden h-[160px]">
          <div className={isDisplayed ? '' : 'opacity-0'}>
            <div className="grid grid-cols-4 gap-2">
              {
                FEE_TIERS_DATA.map((feeTier) => {
                  const isSelected = feeTier.value === currentFee;
                  return (
                    <div
                      onClick={onChangeFee(feeTier.value)}
                      key={get(feeTier, 'label')}
                      className={cx('border relative border-border-1-subtle rounded-border-radius-large p-4 flex flex-col justify-between gap-y-6 cursor-pointer hover:opacity-75 transition', {
                        'bg-button-sec-fill': isSelected,
                      })}
                    >
                      <div className="flex flex-col gap-y-2">
                        <p className="text-font-size-175">{get(feeTier, 'value')}%</p>
                        <p className="text-font-size-150">{get(feeTier, 'label')}</p>
                      </div>
                      <div>
                        <p className="text-font-size-150 text-text-subtle">$5.4MTVL</p>
                        <p className="text-font-size-150 text-text-subtle">6.753% select</p>
                      </div>
                      {
                        isSelected &&  <div className="absolute right-2 top-2">
                        <Icon name="app_status_checked" />
                      </div>
                      }
                     
                    </div>
                  )
                })
              }
            </div>
          </div>
        </Disclosure.Panel>
      </Transition>
    </Disclosure>


  );
}

export default FeeSelections;