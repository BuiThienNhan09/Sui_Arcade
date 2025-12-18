'use client';

import { ReactNode } from 'react';
import { useParallax } from './ParallaxContainer';

interface ScrollSectionProps {
    index: number;
    children: ReactNode;
    className?: string;
}

export default function ScrollSection({ index, children, className = '' }: ScrollSectionProps) {
    const { currentSection } = useParallax();

    // Calculate animation state based on current section vs this section's index
    const diff = currentSection - index;

    // Visibility and animation logic:
    // diff = 0: This is the active section (fully visible, centered)
    // diff > 0: We scrolled past this section (it should be above, faded out)
    // diff < 0: We haven't reached this section yet (it should be below, faded out)

    let opacity = 0;
    let translateY = 0;

    if (diff === 0) {
        // Active section
        opacity = 1;
        translateY = 0;
    } else if (diff === 1) {
        // We scrolled down, this section is now above (hover up and fade out)
        opacity = 0;
        translateY = -30; // vh
    } else if (diff === -1) {
        // We scrolled up, this section is now below (hover down and fade out)
        opacity = 0;
        translateY = 30; // vh
    } else {
        // More than 1 section away - fully hidden
        opacity = 0;
        translateY = diff > 0 ? -50 : 50;
    }

    const isVisible = Math.abs(diff) <= 1;

    return (
        <section
            className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center transition-all duration-500 ease-out ${className}`}
            style={{
                opacity,
                transform: `translateY(${translateY}vh)`,
                pointerEvents: diff === 0 ? 'auto' : 'none',
                visibility: isVisible ? 'visible' : 'hidden',
            }}
        >
            {children}
        </section>
    );
}
