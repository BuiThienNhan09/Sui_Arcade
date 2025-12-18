'use client';

import Image from 'next/image';

/**
 * Home Layer - Only foreground elements that animate
 * Background (clouds, ground) handled by BackgroundLayer
 */
export default function HomeLayer() {
    return (
        <div className="relative w-full h-full">
            {/* Moon Ring - Top Left area */}
            <div className="absolute top-[8%] left-[12%] w-[4%] min-w-[40px] max-w-[60px]">
                <Image
                    src="/assets/moon_ring.webp"
                    alt="Moon"
                    width={60}
                    height={60}
                    className="w-full h-auto"
                />
            </div>

            {/* Arcade Logo - Top Center */}
            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[8%] min-w-[80px] max-w-[120px] hover:scale-110 transition-transform cursor-pointer">
                <Image
                    src="/assets/suiarcade_logo.webp"
                    alt="Sui Arcade Logo"
                    width={120}
                    height={120}
                    className="w-full h-auto rounded-xl border-4 border-white/30 shadow-lg bg-indigo-900/40"
                />
            </div>

            {/* Exclamation Sticker - Right of title */}
            <div className="absolute top-[28%] right-[28%] w-[3%] min-w-[30px] max-w-[50px]">
                <Image
                    src="/assets/exclamation_sticker.webp"
                    alt="!"
                    width={50}
                    height={50}
                    className="w-full h-auto"
                />
            </div>

            {/* Title Text - Center */}
            <div className="absolute top-[32%] left-1/2 -translate-x-1/2 text-center w-full px-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-relaxed tracking-wider"
                    style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.3)' }}>
                    SUIARCADE<br />GAME
                </h1>
            </div>

            {/* Gray Cat - Bottom Left */}
            <div className="absolute bottom-[18%] left-[8%] w-[6%] min-w-[50px] max-w-[80px]">
                <Image
                    src="/assets/gray_cat.webp"
                    alt="Gray Cat"
                    width={80}
                    height={80}
                    className="w-full h-auto"
                />
            </div>

            {/* Orange Cat - Bottom Left-Center */}
            <div className="absolute bottom-[22%] left-[22%] w-[5%] min-w-[45px] max-w-[70px]">
                <Image
                    src="/assets/orange_cat.webp"
                    alt="Orange Cat"
                    width={70}
                    height={70}
                    className="w-full h-auto"
                />
            </div>

            {/* Mushrooms - Near Orange Cat */}
            <div className="absolute bottom-[22%] left-[28%] w-[4%] min-w-[35px] max-w-[60px]">
                <Image
                    src="/assets/mushrooms.webp"
                    alt="Mushrooms"
                    width={60}
                    height={60}
                    className="w-full h-auto"
                />
            </div>

            {/* Black Cat - Bottom Right */}
            <div className="absolute bottom-[25%] right-[12%] w-[7%] min-w-[60px] max-w-[100px]">
                <Image
                    src="/assets/black_cat.webp"
                    alt="Black Cat"
                    width={100}
                    height={100}
                    className="w-full h-auto"
                />
            </div>
        </div>
    );
}
