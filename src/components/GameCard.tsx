'use client';

import Image from 'next/image';
import { GameConfig } from '@/config/games';

interface GameCardProps {
    game: GameConfig;
}

export default function GameCard({ game }: GameCardProps) {
    return (
        <div className="flex flex-col items-center gap-4 group cursor-pointer transition-transform hover:-translate-y-2">
            {/* Card Container */}
            <div className="relative w-48 h-48 bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                <div className="p-4 w-full h-full flex items-center justify-center">
                    <Image
                        src={game.imageUrl}
                        alt={game.title}
                        width={150}
                        height={150}
                        className="w-full h-auto object-contain"
                    />
                </div>
            </div>

            {/* Label Pill */}
            <div className="bg-white px-6 py-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black font-bold text-sm tracking-wider uppercase">
                {game.title}
            </div>
        </div>
    );
}
