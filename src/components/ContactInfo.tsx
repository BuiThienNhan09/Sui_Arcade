'use client';

export default function ContactInfo() {
    return (
        // Matching the blue/transparent box style in ref (Follow Us layer)
        <div className="bg-[#5c94ab]/90 backdrop-blur-sm border-2 border-white rounded-2xl p-4 shadow-lg min-w-[280px]">
            <div className="flex flex-col gap-3 text-white text-[10px] md:text-xs font-bold tracking-wide font-sans">
                <div className="flex justify-between items-center border-b border-white/30 pb-1">
                    <span className="opacity-80">EMAIL:</span>
                    <span className="text-right select-all">contact@pixelarcade.com</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                    <span className="opacity-80">PHONE:</span>
                    <span className="text-right select-all">1-555-PIXEL-UP</span>
                </div>
            </div>
        </div>
    );
}
