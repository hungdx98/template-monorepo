import Button from '@/components/Button';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

export const YourPositions: FC = () => {
    const t = useTranslations();

    return (
        <div className="border border-border-1-subtle rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px]">
            <div className="p-3 rounded-[8px] mb-4 bg-button-sec-fill">
                <span role="img" aria-label="wallet">💼</span>
            </div>
            <p className="mb-2 text-lg font-medium">{t("connect_y_wallet")}</p>
            <p className="mb-4 text-gray-400 text-sm text-center">
                {t("view_positions_title")}
            </p>
            <div className="flex gap-2">
                <Button
                    size='md'
                    className="bg-button-sec-fill"
                >
                    {t("new_position")}
                </Button>
                
                <Button
                    size='md'
                    className="bg-white text-black whitespace-nowrap"
                >
                    {t("connect_wallet")}
                </Button>
            </div>
        </div>
    );
}