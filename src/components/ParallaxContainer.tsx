'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface ParallaxContextType {
    currentSection: number;
    progress: number; // 0 to 2 (for 3 sections)
    scrollToSection: (index: number) => void;
}

const ParallaxContext = createContext<ParallaxContextType>({
    currentSection: 0,
    progress: 0,
    scrollToSection: () => { },
});

export function useParallax() {
    return useContext(ParallaxContext);
}

const TOTAL_SECTIONS = 3;

export default function ParallaxContainer({ children }: { children: ReactNode }) {
    const [currentSection, setCurrentSection] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);

    const scrollToSection = useCallback((index: number) => {
        if (index < 0 || index >= TOTAL_SECTIONS || isScrolling) return;

        setIsScrolling(true);
        setCurrentSection(index);
        setProgress(index);

        // Allow scroll again after animation completes
        setTimeout(() => setIsScrolling(false), 600);
    }, [isScrolling]);

    useEffect(() => {
        let touchStartY = 0;
        let lastScrollTime = 0;
        const scrollCooldown = 800; // ms between scroll actions

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            const now = Date.now();
            if (now - lastScrollTime < scrollCooldown) return;

            if (e.deltaY > 30 && currentSection < TOTAL_SECTIONS - 1) {
                scrollToSection(currentSection + 1);
                lastScrollTime = now;
            } else if (e.deltaY < -30 && currentSection > 0) {
                scrollToSection(currentSection - 1);
                lastScrollTime = now;
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const now = Date.now();
            if (now - lastScrollTime < scrollCooldown) return;

            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;

            if (diff > 50 && currentSection < TOTAL_SECTIONS - 1) {
                scrollToSection(currentSection + 1);
                lastScrollTime = now;
            } else if (diff < -50 && currentSection > 0) {
                scrollToSection(currentSection - 1);
                lastScrollTime = now;
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const now = Date.now();
            if (now - lastScrollTime < scrollCooldown) return;

            if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentSection < TOTAL_SECTIONS - 1) {
                scrollToSection(currentSection + 1);
                lastScrollTime = now;
            } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentSection > 0) {
                scrollToSection(currentSection - 1);
                lastScrollTime = now;
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentSection, scrollToSection]);

    return (
        <ParallaxContext.Provider value={{ currentSection, progress, scrollToSection }}>
            <main className="relative w-full h-screen overflow-hidden">
                {children}
            </main>
        </ParallaxContext.Provider>
    );
}
