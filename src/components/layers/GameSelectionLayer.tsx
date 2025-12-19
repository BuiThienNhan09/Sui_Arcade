'use client';

import { useState, useEffect } from 'react';
import GameCard from '../GameCard';
import WalletButtons from '../WalletButtons';
import { games } from '@/config/games';

export default function GameSelectionLayer() {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <div className="relative w-full h-full">
            {/* Wallet Buttons - Top Right on desktop, Top Center on mobile */}
            <div
                className="absolute"
                style={{
                    top: isDesktop ? '5%' : '5%',
                    right: isDesktop ? '5%' : '50%',
                    transform: isDesktop ? 'none' : 'translateX(50%)',
                    zIndex: 50
                }}
            >
                <WalletButtons />
            </div>

            {/* Game Cards Container - Centered in sky area */}
            <div
                className="absolute w-full px-4"
                style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 40
                }}
            >
                <div
                    className="flex justify-center items-center max-w-[1200px] mx-auto"
                    style={{
                        flexDirection: isDesktop ? 'row' : 'row',
                        flexWrap: 'wrap',
                        gap: isDesktop ? '3rem' : '1rem',
                    }}
                >
                    {games.map((game) => (
                        <GameCard key={game.id} game={game} isDesktop={isDesktop} />
                    ))}
                </div>
            </div>
        </div>
    );
}
