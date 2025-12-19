'use client';

import Image from 'next/image';
import { GameConfig } from '@/config/games';

interface GameCardProps {
    game: GameConfig;
    isDesktop?: boolean;
}

export default function GameCard({ game, isDesktop = true }: GameCardProps) {
    // Mobile: much smaller cards to fit all 3 on screen
    // Desktop: larger cards
    const cardSize = isDesktop ? 'w-40 h-40 md:w-48 md:h-48' : 'w-20 h-20';
    const labelSize = isDesktop ? 'text-xs md:text-sm px-6 py-2' : 'text-[8px] px-3 py-1';
    const borderWidth = isDesktop ? 'border-4' : 'border-2';
    const shadowSize = isDesktop
        ? 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
        : 'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
    const labelShadow = isDesktop
        ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
        : 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]';

    return (
        <div className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:-translate-y-2">
            {/* Card Container */}
            <div className={`relative ${cardSize} bg-white rounded-2xl ${borderWidth} border-black ${shadowSize} overflow-hidden transition-shadow flex items-center justify-center p-2`}>
                <Image
                    src={game.imageUrl}
                    alt={game.title}
                    width={180}
                    height={180}
                    className="w-full h-full object-contain"
                    priority
                />
            </div>

            {/* Label Pill */}
            <div className={`bg-white ${labelSize} rounded-full ${borderWidth} border-black ${labelShadow} text-black font-bold tracking-wider uppercase whitespace-nowrap`}>
                {game.title}
            </div>
        </div>
    );
}
