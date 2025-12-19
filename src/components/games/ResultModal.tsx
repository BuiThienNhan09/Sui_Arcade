'use client';

import { GameResult } from '@/lib/xoLogic';

interface ResultModalProps {
    result: GameResult;
    payout: number;
    onPlayAgain: () => void;
    onGoBack: () => void;
    isClaiming?: boolean;
}

export default function ResultModal({ result, payout, onPlayAgain, onGoBack, isClaiming = false }: ResultModalProps) {
    const resultConfig = {
        win: {
            title: 'YOU WIN!',
            color: 'text-green-500',
            message: `You earned ${payout} SUI!`,
        },
        lose: {
            title: 'YOU LOSE',
            color: 'text-red-500',
            message: 'Better luck next time!',
        },
        tie: {
            title: 'TIE GAME',
            color: 'text-yellow-500',
            message: `You get ${payout} SUI back!`,
        },
        ongoing: {
            title: '',
            color: '',
            message: '',
        },
    };

    const config = resultConfig[result];

    if (result === 'ongoing') return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 rounded-xl text-center max-w-md w-full mx-4">
                {/* Result Title */}
                <h2 className={`text-3xl md:text-4xl font-bold ${config.color} mb-4`}>
                    {config.title}
                </h2>

                {/* Message */}
                <p className="text-black text-lg mb-8">
                    {config.message}
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={onPlayAgain}
                        disabled={isClaiming}
                        className="bg-green-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-3 px-8 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all text-lg disabled:opacity-50"
                    >
                        PLAY AGAIN
                    </button>

                    <button
                        onClick={onGoBack}
                        disabled={isClaiming}
                        className="bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-3 px-8 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all text-lg disabled:opacity-50"
                    >
                        {isClaiming ? 'CLAIMING...' : 'GO BACK'}
                    </button>
                </div>
            </div>
        </div>
    );
}
