export function FeesEarned() {
    return (
        <div className="bg-[#1E1E1E] text-white rounded-xl p-5 w-64 space-y-4">
            <div className="text-sm text-white/70">Fees earned</div>
            <div className="text-2xl font-medium">$0.000133</div>

            <div className="flex justify-between text-xs">
                <div className="text-pink-400">🟪 48.87%</div>
                <div className="text-pink-400">🟪 51.13%</div>
            </div>

            <div className="text-sm space-y-1">
                <div className="flex justify-between">
                    <span className="text-pink-400">🟪 $0.0000650</span>
                    <span className="text-white/60">&lt;0.001 ETH</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-pink-400">🟪 $0.0000680</span>
                    <span className="text-white/60">&lt;0.001 USDC</span>
                </div>
            </div>
        </div>
    );
}
