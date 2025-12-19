'use client';

import Image from 'next/image';

/**
 * Home Layer - Only foreground elements that animate
 * Using vw-based bottom positioning to pin characters to grass as viewport scales
 */
export default function HomeLayer() {
    return (
        <div className="relative w-full h-full">
            {/* Arcade Logo - Top Center */}
            <div
                className="absolute hover:scale-105 transition-transform cursor-pointer"
                style={{ top: '8%', left: '50%', transform: 'translateX(-50%)', width: '8%', minWidth: '80px', maxWidth: '120px', zIndex: 40 }}
            >
                <Image
                    src="/assets/suiarcade_logo.webp"
                    alt="Sui Arcade Logo"
                    width={120}
                    height={120}
                    className="w-full h-auto rounded-xl border-4 border-white/30 shadow-lg"
                />
            </div>

            {/* Title Text - Center */}
            <div
                className="absolute text-center w-full px-4"
                style={{ top: '28%', left: '50%', transform: 'translateX(-50%)', zIndex: 40 }}
            >
                <h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-relaxed tracking-widest"
                    style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.25)' }}
                >
                    SUIARCADE<br />GAME
                </h1>
            </div>

            {/* Exclamation Sticker - Right of title */}
            <div
                className="absolute animate-bounce"
                style={{ top: '26%', right: '22%', width: '4%', minWidth: '35px', maxWidth: '55px', zIndex: 40 }}
            >
                <Image
                    src="/assets/exclamation_sticker.webp"
                    alt="!"
                    width={50}
                    height={50}
                    className="w-full h-auto"
                />
            </div>

            {/* --- CHARACTER LAYER (z-index 30 to sit on top of hills) --- */}
            {/* Using vw-based bottom positioning to pin to grass */}

            {/* Grey Cat: Bottom Left, sleeping */}
            <div
                className="absolute select-none"
                style={{ bottom: '3vw', left: '6%', width: '9%', zIndex: 30 }}
            >
                <Image
                    src="/assets/gray_cat.webp"
                    alt="Sleeping Grey Cat"
                    width={150}
                    height={150}
                    className="w-full h-auto"
                />
            </div>

            {/* Orange Cat: Center Left, sitting */}
            <div
                className="absolute select-none"
                style={{ bottom: '8vw', left: '25%', width: '7%', zIndex: 30 }}
            >
                <Image
                    src="/assets/orange_cat.webp"
                    alt="Sitting Orange Cat"
                    width={120}
                    height={120}
                    className="w-full h-auto"
                />
            </div>

            {/* Mushroom: Next to Orange Cat */}
            <div
                className="absolute select-none"
                style={{ bottom: '8.5vw', left: '33%', width: '3%', zIndex: 30 }}
            >
                <Image
                    src="/assets/mushrooms.webp"
                    alt="Red Mushroom"
                    width={60}
                    height={60}
                    className="w-full h-auto"
                />
            </div>

            {/* Black Cat: Far Right, Standing */}
            <div
                className="absolute select-none"
                style={{ bottom: '11vw', right: '12%', width: '6%', zIndex: 30 }}
            >
                <Image
                    src="/assets/black_cat.webp"
                    alt="Standing Black Cat"
                    width={100}
                    height={100}
                    className="w-full h-auto"
                />
            </div>
        </div>
    );
}
