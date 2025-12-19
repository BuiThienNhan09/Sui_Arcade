'use client';

import { ConnectButton, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';

export default function WalletButtons() {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const [balance, setBalance] = useState<string | null>(null);

    useEffect(() => {
        const fetchBalance = async () => {
            if (!account) {
                setBalance(null);
                return;
            }
            try {
                const balanceResult = await suiClient.getBalance({
                    owner: account.address,
                });
                // Convert from MIST to SUI (1 SUI = 1,000,000,000 MIST)
                const suiBalance = Number(balanceResult.totalBalance) / 1_000_000_000;
                setBalance(suiBalance.toFixed(2));
            } catch (e) {
                console.error('Failed to fetch balance:', e);
                setBalance('--');
            }
        };

        fetchBalance();
        // Refresh balance every 10 seconds
        const interval = setInterval(fetchBalance, 10000);
        return () => clearInterval(interval);
    }, [account, suiClient]);

    const handleTopUp = () => {
        window.open('https://faucet.sui.io/', '_blank');
    };

    return (
        <div className="flex items-center gap-3">
            {/* Connect Button Override Styles */}
            <style jsx global>{`
        div[data-testid="connect-wallet-button"] > button {
          background-color: white !important;
          color: black !important;
          border: 4px solid black !important;
          border-radius: 9999px !important;
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

            {/* Order: Top Up | Balance | Connect Wallet */}

            {/* Top Up Button (shown when connected) */}
            {account && (
                <button
                    onClick={handleTopUp}
                    className="bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-2 px-6 hover:-translate-y-[2px] active:translate-y-0 active:shadow-none transition-all text-sm whitespace-nowrap"
                >
                    TOP UP
                </button>
            )}

            {/* Balance Display (shown when connected) */}
            {account && balance !== null && (
                <div className="bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-2 px-4 text-sm whitespace-nowrap">
                    {balance} SUI
                </div>
            )}

            {/* Connect Wallet Button */}
            <div data-testid="connect-wallet-button">
                <ConnectButton />
            </div>
        </div>
    );
}
