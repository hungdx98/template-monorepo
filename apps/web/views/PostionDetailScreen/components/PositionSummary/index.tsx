export function PositionSummary() {
    return (
        <div className="bg-[#1E1E1E] text-white rounded-xl p-5 space-y-4 w-full">
            <div className="text-sm text-white/70">Position</div>
            <div className="text-2xl font-medium">$0.502</div>

            <div className="flex justify-between text-xs">
                <div className="flex items-center gap-1 text-blue-400">🟦 50%</div>
                <div className="flex items-center gap-1 text-blue-400">🟦 50%</div>
            </div>

            <div className="text-sm space-y-1">
                <div className="flex justify-between">
                    <span className="text-blue-400">🟦 $0.251</span>
                    <span className="text-white/60">&lt;0.001 ETH</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-blue-400">🟦 $0.251</span>
                    <span className="text-white/60">0.251 USDC</span>
                </div>
            </div>
        </div>
    );
}