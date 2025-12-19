'use client';

import { useCallback, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { XO_CONTRACT, getEntryFee } from '@/lib/xoContract';
import { GameResult } from '@/lib/xoLogic';

interface GameSession {
    sessionId: string;
    boardSize: number;
}

export function useXOGame() {
    const suiClient = useSuiClient();
    const account = useCurrentAccount();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentSession, setCurrentSession] = useState<GameSession | null>(null);

    /**
     * Start a new game by paying entry fee
     */
    const startGame = useCallback(async (boardSize: number): Promise<boolean> => {
        if (!account) {
            setError('Wallet not connected');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const entryFee = getEntryFee(boardSize);

            // Create transaction
            const tx = new Transaction();

            // Split coin for entry fee
            const [coin] = tx.splitCoins(tx.gas, [entryFee]);

            // Call start_game
            const [session] = tx.moveCall({
                target: `${XO_CONTRACT.PACKAGE_ID}::${XO_CONTRACT.MODULE}::start_game`,
                arguments: [
                    tx.object(XO_CONTRACT.GAME_POOL_ID),
                    tx.pure.u8(boardSize),
                    coin,
                ],
            });

            // Transfer session to player (keep it for claiming later)
            tx.transferObjects([session], account.address);

            // Execute
            const result = await signAndExecute({
                transaction: tx,
            });

            // Wait for transaction
            await suiClient.waitForTransaction({ digest: result.digest });

            // Find the created GameSession object
            const txResult = await suiClient.getTransactionBlock({
                digest: result.digest,
                options: { showObjectChanges: true },
            });

            const sessionObj = txResult.objectChanges?.find(
                (change) =>
                    change.type === 'created' &&
                    change.objectType?.includes('GameSession')
            );

            if (sessionObj && sessionObj.type === 'created') {
                setCurrentSession({
                    sessionId: sessionObj.objectId,
                    boardSize,
                });
            }

            setIsLoading(false);
            return true;
        } catch (err) {
            console.error('Failed to start game:', err);
            setError(err instanceof Error ? err.message : 'Failed to start game');
            setIsLoading(false);
            return false;
        }
    }, [account, signAndExecute, suiClient]);

    /**
     * Claim game result (win/tie/loss)
     */
    const claimResult = useCallback(async (result: GameResult): Promise<boolean> => {
        if (!account || !currentSession) {
            setError('No active game session');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const tx = new Transaction();

            if (result === 'win') {
                tx.moveCall({
                    target: `${XO_CONTRACT.PACKAGE_ID}::${XO_CONTRACT.MODULE}::claim_win`,
                    arguments: [
                        tx.object(XO_CONTRACT.GAME_POOL_ID),
                        tx.object(currentSession.sessionId),
                    ],
                });
            } else if (result === 'tie') {
                tx.moveCall({
                    target: `${XO_CONTRACT.PACKAGE_ID}::${XO_CONTRACT.MODULE}::claim_tie`,
                    arguments: [
                        tx.object(XO_CONTRACT.GAME_POOL_ID),
                        tx.object(currentSession.sessionId),
                    ],
                });
            } else if (result === 'lose') {
                tx.moveCall({
                    target: `${XO_CONTRACT.PACKAGE_ID}::${XO_CONTRACT.MODULE}::claim_loss`,
                    arguments: [
                        tx.object(currentSession.sessionId),
                    ],
                });
            }

            const txResult = await signAndExecute({
                transaction: tx,
            });

            await suiClient.waitForTransaction({ digest: txResult.digest });

            setCurrentSession(null);
            setIsLoading(false);
            return true;
        } catch (err) {
            console.error('Failed to claim result:', err);
            setError(err instanceof Error ? err.message : 'Failed to claim result');
            setIsLoading(false);
            return false;
        }
    }, [account, currentSession, signAndExecute, suiClient]);

    /**
     * Forfeit current game (claim as loss)
     */
    const forfeitGame = useCallback(async (): Promise<boolean> => {
        return claimResult('lose');
    }, [claimResult]);

    return {
        startGame,
        claimResult,
        forfeitGame,
        isLoading,
        error,
        currentSession,
        hasActiveSession: !!currentSession,
    };
}
