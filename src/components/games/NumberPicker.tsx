'use client';

import { formatNumber } from '@/lib/lotoLogic';

interface NumberPickerProps {
    selectedNumbers: Set<number>;
    onSelectNumber: (num: number) => void;
    maxSelection: number;
}

export default function NumberPicker({ selectedNumbers, onSelectNumber, maxSelection }: NumberPickerProps) {
    const numbers = Array.from({ length: 100 }, (_, i) => i);

    return (
        <div className="w-full max-w-lg">
            <div className="text-center mb-4">
                <span className="text-white font-bold text-sm">
                    Select {maxSelection} numbers: {selectedNumbers.size}/{maxSelection}
                </span>
            </div>

            <div
                className="grid gap-1 bg-white/10 p-3 rounded-xl border-2 border-white/20"
                style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}
            >
                {numbers.map((num) => {
                    const isSelected = selectedNumbers.has(num);
                    const isFull = selectedNumbers.size >= maxSelection;

                    return (
                        <button
                            key={num}
                            onClick={() => onSelectNumber(num)}
                            disabled={!isSelected && isFull}
                            className={`
                w-8 h-8 md:w-9 md:h-9
                text-xs md:text-sm font-bold
                border-2 border-black
                transition-all
                ${isSelected
                                    ? 'bg-green-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                    : isFull
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-white text-black hover:bg-blue-100 hover:scale-105'
                                }
              `}
                        >
                            {formatNumber(num)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
