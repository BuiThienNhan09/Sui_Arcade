'use client';

import { useCallback, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { LOTO_CONTRACT, getBetInMist } from '@/lib/lotoContract';

interface GameResult {
    linesWon: number;
    payout: number;
    drawSequence: number[];
    txDigest: string;
}

export function useLotoGame() {
    const suiClient = useSuiClient();
    const account = useCurrentAccount();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [gameResult, setGameResult] = useState<GameResult | null>(null);

    /**
     * Play a complete game with on-chain randomness
     * cardNumbers: array of 24 numbers (1-75) the player selected
     * betAmount: SUI amount to bet
     */
    const playGame = useCallback(async (cardNumbers: number[], betAmount: number): Promise<GameResult | null> => {
        if (!account) {
            setError('Wallet not connected');
            return null;
        }

        if (cardNumbers.length !== 24) {
            setError('Card must have exactly 24 numbers');
            return null;
        }

        setIsLoading(true);
        setError(null);
        setGameResult(null);

        try {
            const betMist = getBetInMist(betAmount);
            const tx = new Transaction();

            // Split coin for bet
            const [coin] = tx.splitCoins(tx.gas, [betMist]);

            // Convert card numbers to u8 array for Move
            const cardNumbersU8 = cardNumbers.map(n => Math.min(75, Math.max(1, Math.floor(n))));

            // Call play_game with on-chain random
            tx.moveCall({
                target: `${LOTO_CONTRACT.PACKAGE_ID}::${LOTO_CONTRACT.MODULE}::play_game`,
                arguments: [
                    tx.object(LOTO_CONTRACT.LOTO_POOL_ID),
                    coin,
                    tx.pure.vector('u8', cardNumbersU8),
                    tx.object(LOTO_CONTRACT.RANDOM_OBJECT_ID),
                ],
            });

            const result = await signAndExecute({
                transaction: tx,
            });

            await suiClient.waitForTransaction({ digest: result.digest });

            // Get transaction details to read the GamePlayed event
            const txDetails = await suiClient.getTransactionBlock({
                digest: result.digest,
                options: { showEvents: true },
            });

            // Parse GamePlayed event
            const gameEvent = txDetails.events?.find(
                (e) => e.type.includes('GamePlayed')
            );

            let linesWon = 0;
            let payout = 0;
            let drawSequence: number[] = [];

            if (gameEvent && gameEvent.parsedJson) {
                const eventData = gameEvent.parsedJson as {
                    lines_won: string;
                    payout: string;
                    draw_sequence: number[];
                };
                linesWon = parseInt(eventData.lines_won);
                payout = parseInt(eventData.payout) / 1_000_000_000; // Convert MIST to SUI
                drawSequence = eventData.draw_sequence || [];
            }

            const gameResultData: GameResult = {
                linesWon,
                payout,
                drawSequence,
                txDigest: result.digest,
            };

            setGameResult(gameResultData);
            setIsLoading(false);
            return gameResultData;
        } catch (err) {
            console.error('Failed to play game:', err);
            setError(err instanceof Error ? err.message : 'Failed to play game');
            setIsLoading(false);
            return null;
        }
    }, [account, signAndExecute, suiClient]);

    const resetGame = useCallback(() => {
        setGameResult(null);
        setError(null);
    }, []);

    return {
        playGame,
        resetGame,
        isLoading,
        error,
        gameResult,
    };
}
