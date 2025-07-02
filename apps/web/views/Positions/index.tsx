"use client"
import { TopPools, YourPositions } from './components';

export default function Positions() {


    return (
        <div className="min-h-screen bg-background text-white p-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold mb-2">Your positions</h2>
                    <YourPositions />
                </div>
                <div className="w-full md:w-80">
                    <TopPools />
                </div>
            </div>
        </div>
    );
}