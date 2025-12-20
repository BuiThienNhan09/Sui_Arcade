'use client';

import { useEffect, useState } from 'react';

interface DialogueBubbleProps {
    isVisible: boolean;
}

export default function DialogueBubble({ isVisible }: DialogueBubbleProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => setShow(true), 800);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [isVisible]);

    return (
        // Positioned relative to Black Cat (bottom: 11vw, right: 12%)
        // Dialogue bubble appears above and slightly left of the cat
        <div
            className={`absolute bg-white border-4 border-black p-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center transition-all duration-500 ease-out origin-bottom ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'}`}
            style={{ bottom: '20vw', right: '10%', width: '160px', zIndex: 50 }}
        >
            <p className="text-black text-[10px] font-bold leading-relaxed">
                Did you enjoy our arcade?
            </p>

            {/* Speech Bubble Tail */}
            <div
                className="absolute w-4 h-4 bg-white border-b-4 border-r-4 border-black transform rotate-45"
                style={{ bottom: '-10px', right: '30px' }}
            />
        </div>
    );
}
