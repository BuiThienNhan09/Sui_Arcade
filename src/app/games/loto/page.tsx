'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentAccount } from '@mysten/dapp-kit';
import LotoCardComponent from '@/components/games/LotoCard';
import NumberPicker from '@/components/games/NumberPicker';
import BetSelector from '@/components/games/BetSelector';
import DrawDisplay from '@/components/games/DrawDisplay';
import {
    TOTAL_CELLS,
    TOTAL_DRAWS,
    DRAW_INTERVAL_MS,
    WIN_MULTIPLIER,
    LotoCard as LotoCardType,
    generateDrawSequence,
    checkWinningLines,
    calculateReward,
    createCardWithFreeSpace,
} from '@/lib/lotoLogic';
import { useLotoGame } from '@/hooks/useLotoGame';

type GamePhase = 'selection' | 'paying' | 'drawing' | 'result';

export default function LotoGamePage() {
    const router = useRouter();
    const account = useCurrentAccount();
    const { startGame, claimReward, isLoading } = useLotoGame();

    // Game state
    const [phase, setPhase] = useState<GamePhase>('selection');
    const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(new Set());
    const [cardNumbers, setCardNumbers] = useState<LotoCardType>([]);
    const [selectedBet, setSelectedBet] = useState<number | null>(null);

    // Draw state
    const [drawSequence, setDrawSequence] = useState<number[]>([]);
    const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
    const [currentDrawIndex, setCurrentDrawIndex] = useState(0);
    const [matchedNumbers, setMatchedNumbers] = useState<Set<number>>(new Set());

    // Result
    const [linesWon, setLinesWon] = useState(0);
    const [reward, setReward] = useState(0);

    // Handle number selection
    const handleSelectNumber = (num: number) => {
        const newSet = new Set(selectedNumbers);
        if (newSet.has(num)) {
            newSet.delete(num);
        } else if (newSet.size < TOTAL_CELLS) {
            newSet.add(num);
        }
        setSelectedNumbers(newSet);
    };

    // Generate random card - fills remaining slots
    const handleRandomCard = () => {
        const newSet = new Set(selectedNumbers);
        const remaining = TOTAL_CELLS - newSet.size;

        if (remaining <= 0) return;

        // Generate random numbers not already selected
        while (newSet.size < TOTAL_CELLS) {
            const num = Math.floor(Math.random() * 100);
            if (!newSet.has(num)) {
                newSet.add(num);
            }
        }

        setSelectedNumbers(newSet);
    };

    // Clear selection
    const handleClearSelection = () => {
        setSelectedNumbers(new Set());
    };

    // Start game
    const handleStartGame = async () => {
        if (!account || selectedNumbers.size !== TOTAL_CELLS || !selectedBet) return;

        setPhase('paying');
        const success = await startGame(selectedBet);

        if (success) {
            // Convert set to card with FREE center
            setCardNumbers(createCardWithFreeSpace(Array.from(selectedNumbers)));
            // Generate draw sequence
            setDrawSequence(generateDrawSequence());
            setDrawnNumbers([]);
            setCurrentDrawIndex(0);
            setMatchedNumbers(new Set());
            setPhase('drawing');
        } else {
            setPhase('selection');
        }
    };

    // Drawing effect
    useEffect(() => {
        if (phase !== 'drawing') return;
        if (currentDrawIndex >= TOTAL_DRAWS) {
            // Drawing complete - calculate results
            const drawnSet = new Set(drawnNumbers);
            const lines = checkWinningLines(cardNumbers, drawnSet);
            const rewardAmount = calculateReward(selectedBet || 0, lines);
            setLinesWon(lines);
            setReward(rewardAmount);
            setPhase('result');
            return;
        }

        const timer = setTimeout(() => {
            const num = drawSequence[currentDrawIndex];
            setDrawnNumbers(prev => [...prev, num]);

            // Check if matched
            if (selectedNumbers.has(num)) {
                setMatchedNumbers(prev => new Set([...prev, num]));
            }

            setCurrentDrawIndex(prev => prev + 1);
        }, DRAW_INTERVAL_MS);

        return () => clearTimeout(timer);
    }, [phase, currentDrawIndex, drawSequence, selectedNumbers, cardNumbers, selectedBet, drawnNumbers]);

    // Claim and close
    const handleClaimAndClose = async () => {
        await claimReward(linesWon);
        resetGame();
    };

    // Reset game
    const resetGame = () => {
        setPhase('selection');
        setSelectedNumbers(new Set());
        setCardNumbers([]);
        setSelectedBet(null);
        setDrawSequence([]);
        setDrawnNumbers([]);
        setCurrentDrawIndex(0);
        setMatchedNumbers(new Set());
        setLinesWon(0);
        setReward(0);
    };

    const handleReturnHome = () => {
        router.push('/?section=1');
    };

    const canStart = selectedNumbers.size === TOTAL_CELLS && selectedBet !== null && account;

    // Selection Phase
    if (phase === 'selection') {
        return (
            <div className="min-h-screen bg-[#5CA6FC] p-4">
                {/* Header */}
                <div className="absolute top-4 left-4">
                    <button
                        onClick={handleReturnHome}
                        className="bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-2 px-6 hover:-translate-y-1 active:translate-y-0 transition-all text-sm"
                    >
                        ← RETURN HOME
                    </button>
                </div>

                <div className="max-w-4xl mx-auto pt-16">
                    {/* Title */}
                    <h1
                        className="text-3xl md:text-5xl text-white font-bold text-center mb-8"
                        style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.25)' }}
                    >
                        BINGO LOTO
                    </h1>

                    {/* Wallet Warning */}
                    {!account && (
                        <div className="bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-3 rounded-xl mb-6 text-center">
                            <p className="text-black font-bold text-sm">⚠️ Connect your wallet to play!</p>
                        </div>
                    )}

                    {/* Bet Selection */}
                    <div className="mb-6">
                        <p className="text-white font-bold text-center mb-3">Select Bet Amount:</p>
                        <BetSelector
                            selectedBet={selectedBet}
                            onSelectBet={setSelectedBet}
                            disabled={!account}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mb-6">
                        <button
                            onClick={handleRandomCard}
                            className="bg-blue-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-2 px-6 hover:-translate-y-1 transition-all text-sm"
                        >
                            RANDOM CARD
                        </button>
                        <button
                            onClick={handleClearSelection}
                            className="bg-red-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-2 px-6 hover:-translate-y-1 transition-all text-sm"
                        >
                            CLEAR ALL
                        </button>
                    </div>

                    {/* Number Picker */}
                    <div className="flex justify-center mb-6">
                        <NumberPicker
                            selectedNumbers={selectedNumbers}
                            onSelectNumber={handleSelectNumber}
                            maxSelection={TOTAL_CELLS}
                        />
                    </div>

                    {/* Preview Card */}
                    {selectedNumbers.size > 0 && (
                        <div className="flex justify-center mb-6">
                            <div>
                                <p className="text-white font-bold text-center mb-2">Your Card:</p>
                                <LotoCardComponent
                                    numbers={createCardWithFreeSpace(Array.from(selectedNumbers).slice(0, TOTAL_CELLS))}
                                    matchedNumbers={new Set()}
                                    isDrawing={false}
                                />
                            </div>
                        </div>
                    )}

                    {/* Start Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleStartGame}
                            disabled={!canStart || isLoading}
                            className={`
                bg-green-400 text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                font-bold rounded-full py-4 px-12 text-xl
                transition-all
                ${canStart && !isLoading ? 'hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'opacity-50 cursor-not-allowed'}
              `}
                        >
                            {isLoading ? 'PROCESSING...' : 'START GAME'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Paying Phase
    if (phase === 'paying') {
        return (
            <div className="min-h-screen bg-[#5CA6FC] flex items-center justify-center p-4">
                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 rounded-xl text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
                    <h2 className="text-xl font-bold text-black mb-2">PLACING BET</h2>
                    <p className="text-gray-600 text-sm">Please confirm in your wallet...</p>
                </div>
            </div>
        );
    }

    // Drawing Phase
    if (phase === 'drawing') {
        return (
            <div className="min-h-screen bg-[#5CA6FC] p-4">
                <div className="max-w-4xl mx-auto pt-8">
                    <h1
                        className="text-2xl md:text-4xl text-white font-bold text-center mb-8"
                        style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.25)' }}
                    >
                        DRAWING...
                    </h1>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                        {/* Draw Display */}
                        <DrawDisplay
                            currentNumber={drawnNumbers[drawnNumbers.length - 1] ?? null}
                            drawnNumbers={drawnNumbers}
                            isDrawing={true}
                        />

                        {/* Player Card */}
                        <div>
                            <p className="text-white font-bold text-center mb-2">Your Card:</p>
                            <LotoCardComponent
                                numbers={cardNumbers}
                                matchedNumbers={matchedNumbers}
                                isDrawing={true}
                            />
                            <p className="text-white text-center mt-2 text-sm">
                                Matched: {matchedNumbers.size}/{TOTAL_CELLS}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Result Phase
    if (phase === 'result') {
        const hasWon = linesWon > 0;

        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 rounded-xl text-center max-w-md w-full">
                    {hasWon ? (
                        <>
                            <h2 className="text-3xl font-bold text-green-500 mb-4">🎉 YOU WIN! 🎉</h2>
                            <p className="text-black text-lg mb-2">
                                Lines Won: <span className="font-bold">{linesWon}</span>
                            </p>
                            <p className="text-black text-xl mb-6">
                                Reward: <span className="font-bold text-green-600">{reward} SUI</span>
                            </p>
                            <p className="text-gray-500 text-xs mb-4">
                                ({linesWon} lines × {selectedBet} SUI × {WIN_MULTIPLIER}x)
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold text-red-500 mb-4">NO LINES</h2>
                            <p className="text-black text-lg mb-6">Better luck next time!</p>
                        </>
                    )}

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleClaimAndClose}
                            disabled={isLoading}
                            className="bg-green-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-3 px-8 hover:-translate-y-1 transition-all text-lg disabled:opacity-50"
                        >
                            {isLoading ? 'PROCESSING...' : hasWon ? 'CLAIM REWARD' : 'PLAY AGAIN'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
