'use client';

import { formatNumber, GRID_SIZE, CENTER_INDEX, LotoCard } from '@/lib/lotoLogic';

interface LotoCardProps {
    numbers: LotoCard;
    matchedNumbers: Set<number>;
    isDrawing: boolean;
}

export default function LotoCardComponent({ numbers, matchedNumbers, isDrawing }: LotoCardProps) {
    return (
        <div
            className="inline-grid gap-1 bg-black p-2 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        >
            {numbers.map((cell, idx) => {
                const isFree = idx === CENTER_INDEX || cell === 'FREE';
                const isMatched = isFree || (typeof cell === 'number' && matchedNumbers.has(cell));

                return (
                    <div
                        key={idx}
                        className={`
              w-12 h-12 md:w-14 md:h-14
              flex items-center justify-center
              font-bold text-sm md:text-lg
              border-2 border-black
              transition-all duration-300
              relative
              ${isFree
                                ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-black'
                                : isMatched
                                    ? 'bg-yellow-400 text-black'
                                    : 'bg-white text-black'
                            }
              ${isMatched && !isFree ? 'animate-pulse' : ''}
            `}
                    >
                        {isFree ? (
                            <span className="text-2xl">⭐</span>
                        ) : typeof cell === 'number' ? (
                            <>
                                {formatNumber(cell)}
                                {isMatched && (
                                    <span className="absolute text-green-600 text-xl">✓</span>
                                )}
                            </>
                        ) : (
                            '--'
                        )}
                    </div>
                );
            })}
        </div>
    );
}
