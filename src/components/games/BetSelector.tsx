'use client';

import { BET_AMOUNTS } from '@/lib/lotoLogic';

interface BetSelectorProps {
    selectedBet: number | null;
    onSelectBet: (bet: number) => void;
    disabled: boolean;
}

export default function BetSelector({ selectedBet, onSelectBet, disabled }: BetSelectorProps) {
    return (
        <div className="flex flex-wrap justify-center gap-3">
            {BET_AMOUNTS.map((bet) => (
                <button
                    key={bet}
                    onClick={() => onSelectBet(bet)}
                    disabled={disabled}
                    className={`
            px-4 py-2 md:px-6 md:py-3
            font-bold text-sm md:text-base
            border-4 border-black
            rounded-full
            transition-all
            ${selectedBet === bet
                            ? 'bg-green-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                            : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    {bet} SUI
                </button>
            ))}
        </div>
    );
}
