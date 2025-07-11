import DropdownMenu from "@/components/DropdownMenu";
import { useTranslations } from "next-intl";

const LeftHeader = () => {

  const t = useTranslations()

  const menuPoolList = [
    {
      label: t('view_positions'),
      href: '/positions'
    },
    {
      label: t('create_position'),
      href: '/positions/create'
    }
  ]
  return (
    <div>
      <DropdownMenu
        title={t('pool')}
        menuList={menuPoolList}
      />
    </div>
  );
}
 
export default LeftHeader;