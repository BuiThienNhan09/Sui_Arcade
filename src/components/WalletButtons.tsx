'use client';

import { ConnectButton, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function WalletButtons() {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const [balance, setBalance] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

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
                const suiBalance = Number(balanceResult.totalBalance) / 1_000_000_000;
                setBalance(suiBalance.toFixed(2));
            } catch (e) {
                console.error('Failed to fetch balance:', e);
                setBalance('--');
            }
        };

        fetchBalance();
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

            {/* Desktop: Show all buttons */}
            {/* Mobile: Collapsed menu */}

            {account && (
                <>
                    {/* Mobile: Collapsed dropdown toggle */}
                    <div className="md:hidden relative">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-2 px-4 flex items-center gap-1"
                        >
                            <span className="text-sm">{balance} SUI</span>
                            <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown menu */}
                        {isExpanded && (
                            <div className="absolute top-full right-0 mt-2 flex flex-col gap-2 z-50">
                                <button
                                    onClick={() => { handleTopUp(); setIsExpanded(false); }}
                                    className="bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-2 px-6 text-sm whitespace-nowrap"
                                >
                                    TOP UP
                                </button>
                                <div data-testid="connect-wallet-button">
                                    <ConnectButton />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Desktop: Full buttons */}
                    <button
                        onClick={handleTopUp}
                        className="hidden md:block bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-2 px-6 hover:-translate-y-[2px] active:translate-y-0 active:shadow-none transition-all text-sm whitespace-nowrap"
                    >
                        TOP UP
                    </button>
                    <div className="hidden md:block bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-2 px-4 text-sm whitespace-nowrap">
                        {balance} SUI
                    </div>
                    <div className="hidden md:block" data-testid="connect-wallet-button">
                        <ConnectButton />
                    </div>
                </>
            )}

            {/* Not connected: Just show connect button */}
            {!account && (
                <div data-testid="connect-wallet-button">
                    <ConnectButton />
                </div>
            )}
        </div>
    );
}
