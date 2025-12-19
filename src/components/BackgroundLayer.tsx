'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

/**
 * Static background layer - clouds and hills
 * Hills position is responsive: -10% mobile, -30% desktop
 */
export default function BackgroundLayer() {
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
        <div className="fixed inset-0 w-full h-screen overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
            {/* Moon: Top leftish */}
            <div
                className="absolute animate-pulse"
                style={{ top: '10%', left: '18%', width: '4%' }}
            >
                <Image
                    src="/assets/moon_ring.webp"
                    alt="Crescent Moon"
                    width={60}
                    height={60}
                    className="w-full h-auto"
                />
            </div>

            {/* Cloud Strip: Top Left */}
            <div
                className="absolute opacity-90"
                style={{ top: '15%', left: '2%', width: '25%' }}
            >
                <Image
                    src="/assets/left_cloud.svg"
                    alt="Cloud Strip"
                    width={400}
                    height={200}
                    className="w-full h-auto"
                    priority
                />
            </div>

            {/* Cloud Pile: Top Right */}
            <div
                className="absolute opacity-90"
                style={{ top: '22%', right: '5%', width: '20%' }}
            >
                <Image
                    src="/assets/right-n-bottom_cloud.svg"
                    alt="Cloud Pile Top"
                    width={400}
                    height={200}
                    className="w-full h-auto"
                    priority
                />
            </div>

            {/* Cloud Pile: Bottom Left (Behind hills) */}
            <div
                className="absolute opacity-80"
                style={{ bottom: '15vw', left: '2%', width: '18%' }}
            >
                <Image
                    src="/assets/right-n-bottom_cloud.svg"
                    alt="Cloud Pile Low"
                    width={300}
                    height={150}
                    className="w-full h-auto"
                />
            </div>

            {/* Hills: Responsive bottom position */}
            <div
                className="absolute select-none"
                style={{ bottom: isDesktop ? '-30%' : '-10%', left: 0, width: '100%' }}
            >
                <Image
                    src="/assets/greenhil_ground.webp"
                    alt="Grassy Hills"
                    width={1920}
                    height={600}
                    className="w-full h-auto"
                    priority
                />
            </div>
        </div>
    );
}
