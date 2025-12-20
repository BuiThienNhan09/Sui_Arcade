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
            className={`absolute bg-white border-2 sm:border-4 border-black p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center transition-all duration-500 ease-out origin-bottom w-[120px] sm:w-[160px] bottom-[23vw] sm:bottom-[20vw] right-[5%] sm:right-[10%] ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'}`}
            style={{ zIndex: 50 }}
        >
            <p className="text-black text-[8px] sm:text-[10px] font-bold leading-relaxed">
                Did you enjoy our arcade?
            </p>

            {/* Speech Bubble Tail */}
            <div
                className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-white border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-black transform rotate-45 -bottom-2 sm:-bottom-[10px] right-5 sm:right-[30px]"
            />
        </div>
    );
}
