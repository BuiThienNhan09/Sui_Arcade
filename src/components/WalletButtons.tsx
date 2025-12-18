'use client';

import { ConnectButton, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useState } from 'react';

export default function WalletButtons() {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const [isToppingUp, setIsToppingUp] = useState(false);

    const handleTopUp = async () => {
        if (!account) return;
        setIsToppingUp(true);
        try {
            const res = await fetch('https://faucet.testnet.sui.io/gas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    FixedAmountRequest: {
                        recipient: account.address,
                    },
                }),
            });
            const data = await res.json();
            if (data.error) {
                alert('Faucet error: ' + data.error);
            } else {
                alert('SUI sent! Check your wallet shortly.');
            }
        } catch (e) {
            console.error(e);
            alert('Failed to top up. Are you on testnet?');
        } finally {
            setIsToppingUp(false);
        }
    };

    return (
        <div className="flex items-center gap-4">
            {/* Connect Button - Styled to match pixel aesthetic */}
            <div className="[&>button]:!bg-white [&>button]:!text-black [&>button]:!border-4 [&>button]:!border-black [&>button]:!shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] [&>button]:!font-['Press_Start_2P'] [&>button]:!rounded-xl [&>button]:!py-3 [&>button]:!px-4 hover:[&>button]:!translate-y-[-2px] active:[&>button]:!translate-y-[0px] active:[&>button]:!shadow-none transition-all">
                <ConnectButton />
            </div>

            {account && (
                <button
                    onClick={handleTopUp}
                    disabled={isToppingUp}
                    className="bg-green-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-['Press_Start_2P'] rounded-xl py-3 px-4 hover:-translate-y-[2px] active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isToppingUp ? '...' : 'TOP UP'}
                </button>
            )}
        </div>
    );
}
