'use client';

import Image from 'next/image';

/**
 * Static background layer that NEVER animates.
 * Clouds and ground stay visible at all times.
 */
export default function BackgroundLayer() {
    return (
        <div className="fixed inset-0 w-full h-screen overflow-hidden pointer-events-none z-0">
            {/* Sky is handled by body background color */}

            {/* Left Cloud */}
            <div className="absolute top-[5%] left-[2%] w-[30%] max-w-[400px]">
                <Image
                    src="/assets/left_cloud.svg"
                    alt="Cloud"
                    width={400}
                    height={200}
                    className="w-full h-auto"
                    priority
                />
            </div>

            {/* Right Cloud */}
            <div className="absolute top-[10%] right-[2%] w-[35%] max-w-[500px]">
                <Image
                    src="/assets/right-n-bottom_cloud.svg"
                    alt="Cloud"
                    width={500}
                    height={300}
                    className="w-full h-auto"
                    priority
                />
            </div>

            {/* Ground - Bottom, stretches full width */}
            <div className="absolute bottom-0 left-0 w-full">
                <Image
                    src="/assets/greenhil_ground.webp"
                    alt="Ground"
                    width={1920}
                    height={400}
                    className="w-full h-auto object-cover object-top"
                    priority
                />
            </div>
        </div>
    );
}
