import cx from "@/utils/styled";
import { ReactNode } from "react";


interface IMainLayout {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'| 'xl'
  
}
const PageContainer = (props: IMainLayout) => {
  const { 
    children, 
    className, 
    size = 'md' 
  } = props;

  const sizeClass = {
    sm: 'max-w-[960px]',
    md: 'max-w-[1280px]',
    lg: 'max-w-[1440px]',
    xl: 'max-w-[1680px]',
  }[size];
  return (
    <div
      className={cx(
        'main-layout-content mx-auto',
        sizeClass,
        className
      )}>
      {children}
    </div>
  );
}


export default PageContainer;