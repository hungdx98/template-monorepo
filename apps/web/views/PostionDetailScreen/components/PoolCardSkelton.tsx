import { Skeleton } from "@/components/Skeleton";

export function PoolCardSkeleton() {
    return (
        <div className="min-h-screen p-6 text-white space-y-4">
            <div className="flex gap-8 justify-center">
                <div className='w-[60%]'>
                    <div className="text-xl font-medium mb-3">
                        <Skeleton className="h-8 w-[30%]" /> {/* v4 badge */}
                    </div>
                    <div className="w-[90%] min-w-[300px] min-h-[480px] rounded-2xl py-8 px-4 flex flex-col justify-between items-center relative shadow-lg bg-[#121212]">
                        <Skeleton className="w-[300px] h-[480px]" /> {/* v4 badge */}
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-[20%]">
                    <Skeleton className="h-[30%]" />
                </div>
            </div>
        </div>
    );
}