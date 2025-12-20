'use client';

import Image from 'next/image';
import DialogueBubble from '../DialogueBubble';
import ContactInfo from '../ContactInfo';
import { useParallax } from '../ParallaxContainer';

export default function FollowUsLayer() {
    const { currentSection } = useParallax();
    const isVisible = currentSection === 2;

    return (
        <div className="relative w-full h-full">
            {/* TITLE - Top Center */}
            <div
                className="absolute text-center w-full"
                style={{ top: '15%', left: '50%', transform: 'translateX(-50%)', zIndex: 40 }}
            >
                <h2
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold tracking-wider"
                    style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.25)' }}
                >
                    FOLLOW US
                </h2>
            </div>

            {/* Social Icons - Below title */}
            <div
                className="absolute flex gap-8 md:gap-12"
                style={{ top: '32%', left: '50%', transform: 'translateX(-50%)', zIndex: 40 }}
            >
                {/* Twitter */}
                <a href="#" className="transform hover:-translate-y-2 transition-transform">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-[#1DA1F2] rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                    </div>
                </a>

                {/* Instagram */}
                <a href="#" className="transform hover:-translate-y-2 transition-transform">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </div>
                </a>

                {/* Discord */}
                <a href="#" className="transform hover:-translate-y-2 transition-transform">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-[#5865F2] rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                        </svg>
                    </div>
                </a>
            </div>

            {/* Contact Info Box - Bottom Right on desktop/tablet, higher on mobile */}
            <div
                className="absolute right-3 sm:right-[21.5%] lg:right-[3%] bottom-[24%] sm:bottom-[5%]"
                style={{ zIndex: 50 }}
            >
                <ContactInfo />
            </div>

            {/* --- CHARACTER LAYER --- */}

            {/* Grey Cat */}
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

            {/* Orange Cat */}
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

            {/* Mushroom */}
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

            {/* Black Cat */}
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

            {/* Dialogue Bubble */}
            <DialogueBubble isVisible={isVisible} />
        </div>
    );
}
