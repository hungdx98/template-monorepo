import cx from "@/utils/styled";
import { CircleAlert, CircleCheck } from "lucide-react"
import { useTranslations } from "next-intl";
import { FC, HTMLAttributes, PropsWithChildren, useMemo } from "react";

export interface NoticeProps extends HTMLAttributes<HTMLSpanElement> {
    className?: string;
    icon?: 'warning' | 'success';
    content: string;
    title?: string;
}

const Notice: FC<PropsWithChildren<NoticeProps>> = ({
    className,
    icon = 'warning',
    children,
    content,
    title,
    ...props
}) => {
    const t = useTranslations();

    const IconComp = useMemo(
        () =>
        ({
            warning: CircleAlert,
            success: CircleCheck,
        }[icon]),
        [icon],
    );

    return <div className={cx("bg-[#1E1E1E] text-sm text-white rounded-lg p-4 flex items-start gap-3 max-w-xl mt-4", className)}>
        <div className="pt-1">
            {!!IconComp && <IconComp className="text-white/70 w-5 h-5" />}
        </div>
        <div className="space-y-1">
            <div className="font-medium">{t(content)}</div>
            {
                !!title && <p className="text-white/70">
                    {t(title)}
                </p>
            }
        </div>
    </div>;
}

export default Notice;