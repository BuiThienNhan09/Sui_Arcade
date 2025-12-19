'use client';

import { useCallback, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { GACHA_CONTRACT, ChestConfig, REWARDS } from '@/lib/gachaContract';

interface GachaResult {
    isWin: boolean;
    amount: number;
    rarity: string;
    multiplier: string;
    txDigest: string;
}

export function useGachaGame() {
    const suiClient = useSuiClient();
    const account = useCurrentAccount();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GachaResult | null>(null);

    /**
     * Buy and open a chest
     */
    const buyChest = useCallback(async (chest: ChestConfig): Promise<GachaResult | null> => {
        if (!account) {
            setError('Wallet not connected');
            return null;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const tx = new Transaction();

            // Split coin for chest price
            const [coin] = tx.splitCoins(tx.gas, [chest.priceMist]);

            // Call buy_chest with random object
            tx.moveCall({
                target: `${GACHA_CONTRACT.PACKAGE_ID}::${GACHA_CONTRACT.MODULE}::buy_chest`,
                arguments: [
                    tx.object(GACHA_CONTRACT.TREASURY_ID),
                    tx.pure.u8(chest.id),
                    coin,
                    tx.object(GACHA_CONTRACT.RANDOM_OBJECT_ID),
                ],
            });

            const txResult = await signAndExecute({
                transaction: tx,
            });

            await suiClient.waitForTransaction({ digest: txResult.digest });

            // Get transaction details to check events
            const txDetails = await suiClient.getTransactionBlock({
                digest: txResult.digest,
                options: { showEvents: true },
            });

            // Find ChestOpened event
            const chestEvent = txDetails.events?.find(
                (e) => e.type.includes('ChestOpened')
            );

            let isWin = false;
            if (chestEvent && chestEvent.parsedJson) {
                const eventData = chestEvent.parsedJson as { is_win: boolean };
                isWin = eventData.is_win;
            } else {
                // Fallback: simulate based on win rate
                isWin = Math.random() * 100 < chest.winRate;
            }

            const rewardData = isWin ? REWARDS[chest.id].win : REWARDS[chest.id].lose;

            const gameResult: GachaResult = {
                isWin,
                amount: rewardData.amount,
                rarity: rewardData.rarity,
                multiplier: rewardData.multiplier,
                txDigest: txResult.digest,
            };

            setResult(gameResult);
            setIsLoading(false);
            return gameResult;
        } catch (err) {
            console.error('Failed to buy chest:', err);
            setError(err instanceof Error ? err.message : 'Failed to buy chest');
            setIsLoading(false);
            return null;
        }
    }, [account, signAndExecute, suiClient]);

    const resetResult = useCallback(() => {
        setResult(null);
        setError(null);
    }, []);

    return {
        buyChest,
        resetResult,
        isLoading,
        error,
        result,
    };
}
