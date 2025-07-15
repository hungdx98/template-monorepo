import React, { forwardRef } from 'react';
import { Tooltip as ReactTooltip, ITooltip, TooltipRefProps } from 'react-tooltip';

const CustomTooltip = forwardRef<HTMLDivElement, ITooltip>((props, ref) => {
    const { anchorSelect, place = 'top', className, variant = 'light', opacity = 1, offset = 5, ...rest } = props;

    return (
        <ReactTooltip
            ref={ref as React.Ref<TooltipRefProps | null>}
            anchorSelect={anchorSelect}
            place={place}
            className={className}
            variant={variant}
            opacity={opacity}
            offset={offset}
            {...rest}
        />
    );
});

CustomTooltip.displayName = 'CustomTooltip';

export { CustomTooltip };