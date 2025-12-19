'use client';

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { useState } from 'react';

export default function WalletButtons() {
    const account = useCurrentAccount();
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
            {/* Connect Button Override - White button, black text, black border */}
            <style jsx global>{`
        div[data-testid="connect-wallet-button"] > button {
          background-color: white !important;
          color: black !important;
          border: 4px solid black !important;
          border-radius: 9999px !important; /* Pill shape */
          font-family: inherit !important;
          font-weight: bold !important;
          box-shadow: 4px 4px 0px 0px rgba(0,0,0,1) !important;
          padding: 10px 20px !important;
          transition: transform 0.1s !important;
        }
        div[data-testid="connect-wallet-button"] > button:hover {
          transform: translateY(-2px) !important;
        }
        div[data-testid="connect-wallet-button"] > button:active {
          transform: translateY(0) !important;
          box-shadow: none !important;
        }
      `}</style>

            <div data-testid="connect-wallet-button">
                <ConnectButton />
            </div>

            {account && (
                <button
                    onClick={handleTopUp}
                    disabled={isToppingUp}
                    className="bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-2 px-6 hover:-translate-y-[2px] active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                >
                    {isToppingUp ? '...' : 'TOP UP'}
                </button>
            )}
        </div>
    );
}
