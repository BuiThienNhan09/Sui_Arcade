'use client';

import { useEffect, useState } from 'react';

interface DialogueBubbleProps {
    isVisible: boolean;
}

export default function DialogueBubble({ isVisible }: DialogueBubbleProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isVisible) {
            // Delay after section becomes active
            const timer = setTimeout(() => setShow(true), 800);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [isVisible]);

    return (
        <div
            className={`absolute bottom-[45%] right-[18%] bg-white border-4 border-black p-3 md:p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-40 max-w-[160px] md:max-w-[180px] text-center transition-all duration-500 ease-out ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'}`}
        >
            <p className="text-black text-[8px] md:text-[10px] font-bold leading-relaxed">
                Did you enjoy our arcade?
            </p>

            {/* Speech Bubble Pointer */}
            <div className="absolute -bottom-3 right-6 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white"></div>
            <div className="absolute -bottom-4 right-6 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-black -z-10"></div>
        </div>
    );
}
