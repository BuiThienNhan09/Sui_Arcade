'use client';

import { formatNumber, TOTAL_DRAWS } from '@/lib/lotoLogic';

interface DrawDisplayProps {
    currentNumber: number | null;
    drawnNumbers: number[];
    isDrawing: boolean;
}

export default function DrawDisplay({ currentNumber, drawnNumbers, isDrawing }: DrawDisplayProps) {
    return (
        <div className="flex flex-col items-center gap-4">
            {/* Current Number Display */}
            <div className="relative">
                <div
                    className={`
            w-24 h-24 md:w-32 md:h-32
            bg-white border-4 border-black
            shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
            flex items-center justify-center
            text-4xl md:text-5xl font-bold text-black
            ${isDrawing ? 'animate-bounce' : ''}
          `}
                >
                    {currentNumber !== null ? formatNumber(currentNumber) : '--'}
                </div>

                {/* Draw counter */}
                <div className="absolute -top-3 -right-3 bg-black text-white px-2 py-1 text-xs font-bold rounded-full">
                    {drawnNumbers.length}/{TOTAL_DRAWS}
                </div>
            </div>

            {/* Draw History */}
            <div className="w-full max-w-md">
                <p className="text-white text-sm font-bold text-center mb-2">Drawn Numbers:</p>
                <div
                    className="bg-white/10 border-2 border-white/20 rounded-xl p-3 h-24 overflow-y-auto"
                >
                    <div className="flex flex-wrap gap-1 justify-center">
                        {drawnNumbers.map((num, idx) => (
                            <span
                                key={idx}
                                className="bg-white text-black text-xs font-bold px-2 py-1 rounded border border-black"
                            >
                                {formatNumber(num)}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
