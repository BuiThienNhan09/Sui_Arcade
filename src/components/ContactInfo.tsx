'use client';

export default function ContactInfo() {
    return (
        <div className="bg-[#5c94ab]/80 backdrop-blur-sm border-4 border-white rounded-2xl p-4 md:px-8 shadow-lg w-full max-w-lg mx-auto">
            <div className="flex flex-col gap-2 text-white text-xs md:text-sm font-bold tracking-wide text-shadow">
                <div className="flex justify-between items-center">
                    <span>EMAIL:</span>
                    <span className="text-right">contact@pixelarcade.com</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>PHONE:</span>
                    <span className="text-right">1-555-PIXEL-UP</span>
                </div>
            </div>
        </div>
    );
}
