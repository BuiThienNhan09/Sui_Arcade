'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentAccount } from '@mysten/dapp-kit';
import XOGame from '@/components/games/XOGame';
import { GAME_CONFIGS, GameResult } from '@/lib/xoLogic';

type GameState = 'select' | 'playing';

// Forfeit confirmation modal
function ForfeitModal({
    onConfirm,
    onCancel,
    entryCost
}: {
    onConfirm: () => void;
    onCancel: () => void;
    entryCost: number;
}) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 rounded-xl text-center max-w-md w-full mx-4">
                <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-4">
                    FORFEIT GAME?
                </h2>

                <p className="text-black text-sm mb-2">
                    Are you sure you want to leave?
                </p>
                <p className="text-red-600 text-sm font-bold mb-8">
                    You will lose your {entryCost} SUI entry fee!
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={onCancel}
                        className="bg-green-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-3 px-8 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all text-lg"
                    >
                        CONTINUE PLAYING
                    </button>

                    <button
                        onClick={onConfirm}
                        className="bg-red-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-3 px-8 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all text-lg"
                    >
                        FORFEIT & LEAVE
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function XOGamePage() {
    const router = useRouter();
    const account = useCurrentAccount();
    const [gameState, setGameState] = useState<GameState>('select');
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [showForfeitModal, setShowForfeitModal] = useState(false);

    const handleSelectSize = (size: number) => {
        if (!account) {
            alert('Please connect your wallet first!');
            return;
        }
        setSelectedSize(size);
        setGameState('playing');
    };

    const handleGameEnd = (result: GameResult) => {
        console.log('Game ended with result:', result);
        // TODO: Call contract to claim payout
    };

    const handleBackClick = () => {
        // Show forfeit confirmation when trying to leave during a game
        setShowForfeitModal(true);
    };

    const handleConfirmForfeit = () => {
        setShowForfeitModal(false);
        setGameState('select');
        setSelectedSize(null);
    };

    const handleCancelForfeit = () => {
        setShowForfeitModal(false);
    };

    const handleGoBack = () => {
        // This is called from ResultModal after game ends (no forfeit needed)
        setGameState('select');
        setSelectedSize(null);
    };

    const handleReturnHome = () => {
        router.push('/?section=1');
    };

    // Size selection screen
    if (gameState === 'select') {
        return (
            <div className="min-h-screen bg-[#5CA6FC] flex flex-col items-center justify-center p-4">
                {/* Header */}
                <div className="absolute top-4 left-4">
                    <button
                        onClick={handleReturnHome}
                        className="bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-2 px-6 hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all text-sm"
                    >
                        ← RETURN HOME
                    </button>
                </div>

                {/* Title */}
                <h1
                    className="text-4xl md:text-6xl text-white font-bold mb-12 text-center"
                    style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.25)' }}
                >
                    XO GAME
                </h1>

                {/* Wallet Warning */}
                {!account && (
                    <div className="bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-3 rounded-xl mb-8">
                        <p className="text-black font-bold text-sm text-center">
                            ⚠️ Connect your wallet to play!
                        </p>
                    </div>
                )}

                {/* Size Selection Cards */}
                <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
                    {Object.entries(GAME_CONFIGS).map(([sizeStr, config]) => {
                        const size = parseInt(sizeStr);
                        return (
                            <button
                                key={size}
                                onClick={() => handleSelectSize(size)}
                                disabled={!account}
                                className={`
                  bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                  rounded-2xl p-6 w-64
                  transition-all
                  ${account ? 'hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                `}
                            >
                                <h2 className="text-3xl font-bold text-black mb-4">
                                    {size}x{size}
                                </h2>

                                <p className="text-sm text-gray-600 mb-4">
                                    {config.winLength} in a row to win
                                </p>

                                <div className="space-y-2 text-left">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Entry:</span>
                                        <span className="text-black font-bold">{config.entryCost} SUI</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600">Win:</span>
                                        <span className="text-green-600 font-bold">+{config.winPayout} SUI</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-yellow-600">Tie:</span>
                                        <span className="text-yellow-600 font-bold">+{config.tiePayout} SUI</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-red-600">Lose:</span>
                                        <span className="text-red-600 font-bold">-{config.entryCost} SUI</span>
                                    </div>
                                </div>

                                <div className="mt-6 bg-green-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full py-2 text-black font-bold">
                                    PLAY
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Game screen
    if (gameState === 'playing' && selectedSize) {
        const config = GAME_CONFIGS[selectedSize];

        return (
            <div className="min-h-screen bg-[#5CA6FC] flex flex-col items-center justify-center p-4">
                {/* Header */}
                <div className="absolute top-4 left-4">
                    <button
                        onClick={handleBackClick}
                        className="bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-2 px-6 hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all text-sm"
                    >
                        ← BACK
                    </button>
                </div>

                {/* Game Info */}
                <div className="mb-6 text-center">
                    <h1
                        className="text-2xl md:text-3xl text-white font-bold mb-2"
                        style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.25)' }}
                    >
                        {selectedSize}x{selectedSize} XO
                    </h1>
                    <p className="text-white/80 text-sm">
                        Get {config.winLength} in a row to win!
                    </p>
                </div>

                {/* Game Component */}
                <XOGame
                    config={config}
                    onGameEnd={handleGameEnd}
                    onGoBack={handleGoBack}
                />

                {/* Forfeit Confirmation Modal */}
                {showForfeitModal && (
                    <ForfeitModal
                        entryCost={config.entryCost}
                        onConfirm={handleConfirmForfeit}
                        onCancel={handleCancelForfeit}
                    />
                )}
            </div>
        );
    }

    return null;
}
