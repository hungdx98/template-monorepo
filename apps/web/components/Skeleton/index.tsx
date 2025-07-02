import cx from "@/utils/styled"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="skeleton"
            className={cx("bg-[#464646] animate-pulse rounded-md", className)}
            {...props}
        />
    )
}
export { Skeleton }