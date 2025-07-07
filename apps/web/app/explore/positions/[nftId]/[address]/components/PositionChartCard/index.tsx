export function PositionChartCard() {
    return (
        <div className="bg-gradient-to-b from-purple-800 to-black text-white rounded-2xl p-4 flex flex-col justify-between w-[300px] h-[480px] relative shadow-lg">
            <div className="text-center text-xl font-medium">USDC/ETH</div>
            <div className="text-center text-sm text-white/70">0.05%</div>

            {/* Curve (placeholder) */}
            <div className="flex-1 flex items-center justify-center">
                <div className="w-32 h-32 border-4 border-purple-300 rounded-full opacity-30" />
            </div>

            <div className="space-y-1 text-xs">
                <div className="bg-white/10 px-2 py-1 rounded">ID: 76958</div>
                <div className="bg-white/10 px-2 py-1 rounded">Hook: No Hook</div>
                <div className="bg-white/10 px-2 py-1 rounded">Min Tick: -887270</div>
                <div className="bg-white/10 px-2 py-1 rounded">Max Tick: 887270</div>
            </div>

            {/* Corner text */}
            <div className="absolute bottom-2 right-2 text-[8px] opacity-50 rotate-90">
                0x639...e913 • USDC
            </div>
        </div>
    );
}
