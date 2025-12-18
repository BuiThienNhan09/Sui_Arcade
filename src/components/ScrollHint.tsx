'use client';

interface ScrollHintProps {
    text: string;
    direction: 'up' | 'down';
}

export default function ScrollHint({ text, direction }: ScrollHintProps) {
    return (
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 animate-pulse z-50">
            {/* Text - vertical */}
            <span
                className="text-[10px] md:text-xs text-white font-bold tracking-[0.2em] uppercase text-shadow"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
                {text}
            </span>

            {/* Arrow icons */}
            <div className={`flex flex-col gap-1 ${direction === 'up' ? 'rotate-180' : ''}`}>
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="opacity-60">
                    <path d="M1 1L8 8L15 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="opacity-80">
                    <path d="M1 1L8 8L15 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="opacity-100">
                    <path d="M1 1L8 8L15 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
        </div>
    );
}
