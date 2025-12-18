'use client';

import GameCard from '../GameCard';
import WalletButtons from '../WalletButtons';
import { games } from '@/config/games';

/**
 * Game Selection Layer - Only foreground elements
 * Background handled by BackgroundLayer
 */
export default function GameSelectionLayer() {
    return (
        <div className="relative w-full h-full">
            {/* Header Area - Wallet Buttons */}
            <div className="absolute top-6 right-6 md:top-8 md:right-8 z-30">
                <WalletButtons />
            </div>

            {/* Game Grid - Centered */}
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-full max-w-5xl z-20 flex flex-wrap justify-center gap-8 md:gap-16 px-4">
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
}
