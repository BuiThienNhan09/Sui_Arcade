'use client';

import { useCallback, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { LOTO_CONTRACT, getBetInMist } from '@/lib/lotoContract';

interface LotoSession {
    sessionId: string;
    betAmount: number;
}

export function useLotoGame() {
    const suiClient = useSuiClient();
    const account = useCurrentAccount();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentSession, setCurrentSession] = useState<LotoSession | null>(null);

    /**
     * Start a new game by paying bet amount
     */
    const startGame = useCallback(async (betAmount: number): Promise<boolean> => {
        if (!account) {
            setError('Wallet not connected');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const betMist = getBetInMist(betAmount);

            const tx = new Transaction();

            // Split coin for bet
            const [coin] = tx.splitCoins(tx.gas, [betMist]);

            // Call start_game
            const [session] = tx.moveCall({
                target: `${LOTO_CONTRACT.PACKAGE_ID}::${LOTO_CONTRACT.MODULE}::start_game`,
                arguments: [
                    tx.object(LOTO_CONTRACT.LOTO_POOL_ID),
                    coin,
                ],
            });

            // Transfer session to player
            tx.transferObjects([session], account.address);

            const result = await signAndExecute({
                transaction: tx,
            });

            await suiClient.waitForTransaction({ digest: result.digest });

            // Find created session
            const txResult = await suiClient.getTransactionBlock({
                digest: result.digest,
                options: { showObjectChanges: true },
            });

            const sessionObj = txResult.objectChanges?.find(
                (change) =>
                    change.type === 'created' &&
                    change.objectType?.includes('LotoSession')
            );

            if (sessionObj && sessionObj.type === 'created') {
                setCurrentSession({
                    sessionId: sessionObj.objectId,
                    betAmount,
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
     * Claim reward based on lines won
     */
    const claimReward = useCallback(async (linesWon: number): Promise<boolean> => {
        if (!account || !currentSession) {
            setError('No active session');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const tx = new Transaction();

            tx.moveCall({
                target: `${LOTO_CONTRACT.PACKAGE_ID}::${LOTO_CONTRACT.MODULE}::claim_reward`,
                arguments: [
                    tx.object(LOTO_CONTRACT.LOTO_POOL_ID),
                    tx.object(currentSession.sessionId),
                    tx.pure.u64(linesWon),
                ],
            });

            const result = await signAndExecute({
                transaction: tx,
            });

            await suiClient.waitForTransaction({ digest: result.digest });

            setCurrentSession(null);
            setIsLoading(false);
            return true;
        } catch (err) {
            console.error('Failed to claim reward:', err);
            setError(err instanceof Error ? err.message : 'Failed to claim');
            setIsLoading(false);
            return false;
        }
    }, [account, currentSession, signAndExecute, suiClient]);

    return {
        startGame,
        claimReward,
        isLoading,
        error,
        currentSession,
        hasActiveSession: !!currentSession,
    };
}
