'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { CHESTS, ChestConfig, REWARDS } from '@/lib/gachaContract';
import { useGachaGame } from '@/hooks/useGachaGame';

// Pixel Chest SVG Components
function WoodenChest({ size = 140 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 40 40" style={{ imageRendering: 'pixelated' }}>
            <ellipse cx="20" cy="36" rx="14" ry="2" fill="#000" opacity="0.2" />
            <rect x="8" y="20" width="24" height="14" fill="#5C3317" />
            <rect x="9" y="21" width="22" height="12" fill="#6F4E37" />
            <rect x="8" y="23" width="24" height="2" fill="#3a3a3a" />
            <rect x="8" y="30" width="24" height="2" fill="#3a3a3a" />
            <rect x="17" y="25" width="6" height="6" fill="#2a2a2a" />
            <rect x="18" y="26" width="4" height="4" fill="#4a4a4a" />
            <rect x="8" y="14" width="24" height="6" fill="#3d2817" />
            <rect x="9" y="15" width="22" height="4" fill="#5C3317" />
        </svg>
    );
}

function GoldenChest({ size = 140 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 40 40" style={{ imageRendering: 'pixelated' }}>
            <ellipse cx="20" cy="36" rx="14" ry="2" fill="#000" opacity="0.3" />
            <rect x="8" y="20" width="24" height="14" fill="#8B6914" />
            <rect x="9" y="21" width="22" height="12" fill="#B8860B" />
            <rect x="10" y="22" width="20" height="10" fill="#DAA520" />
            <rect x="8" y="22" width="24" height="2" fill="#8B6914" />
            <rect x="8" y="29" width="24" height="2" fill="#8B6914" />
            <rect x="16" y="24" width="8" height="7" fill="#8B6914" />
            <rect x="17" y="25" width="6" height="5" fill="#B8860B" />
            <circle cx="20" cy="27" r="1.5" fill="#8B6914" />
            <rect x="8" y="14" width="24" height="6" fill="#6B5A0B" />
            <rect x="9" y="15" width="22" height="4" fill="#8B6914" />
            <circle cx="11" cy="15" r="1.5" fill="#8B0000" />
            <circle cx="29" cy="15" r="1.5" fill="#8B0000" />
        </svg>
    );
}

function DiamondChest({ size = 140 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 40 40" style={{ imageRendering: 'pixelated' }}>
            <ellipse cx="20" cy="36" rx="15" ry="2.5" fill="#00CED1" opacity="0.3" />
            <rect x="8" y="20" width="24" height="14" fill="#0a0a15" />
            <rect x="9" y="21" width="22" height="12" fill="#16213e" />
            <rect x="8" y="22" width="24" height="2" fill="#00CED1" />
            <rect x="8" y="29" width="24" height="2" fill="#00CED1" />
            <rect x="12" y="20" width="1" height="14" fill="#00CED1" />
            <rect x="27" y="20" width="1" height="14" fill="#00CED1" />
            <rect x="16" y="24" width="8" height="8" fill="#00CED1" opacity="0.3" />
            <rect x="19" y="26" width="2" height="1" fill="#00CED1" />
            <rect x="18" y="27" width="4" height="1" fill="#00CED1" />
            <rect x="17" y="28" width="6" height="1" fill="#40E0D0" />
            <rect x="18" y="29" width="4" height="1" fill="#00CED1" />
            <rect x="8" y="14" width="24" height="6" fill="#0a0a15" />
            <rect x="9" y="15" width="22" height="4" fill="#16213e" />
            <circle cx="11" cy="15" r="2" fill="#8B0000" />
            <circle cx="11" cy="15" r="1.2" fill="#FF0000" />
            <circle cx="20" cy="13" r="2" fill="#006400" />
            <circle cx="20" cy="13" r="1.2" fill="#00FF00" />
            <circle cx="29" cy="15" r="2" fill="#00008B" />
            <circle cx="29" cy="15" r="1.2" fill="#0000FF" />
        </svg>
    );
}

function ChestIcon({ id, size = 140 }: { id: number; size?: number }) {
    if (id === 1) return <WoodenChest size={size} />;
    if (id === 2) return <GoldenChest size={size} />;
    return <DiamondChest size={size} />;
}

export default function LuckyChestsPage() {
    const router = useRouter();
    const account = useCurrentAccount();
    const { buyChest, resetResult, isLoading, result } = useGachaGame();

    const [activeChest, setActiveChest] = useState<ChestConfig | null>(null);
    const [isOpening, setIsOpening] = useState(false);
    const [chestOpened, setChestOpened] = useState(false);
    const [showReward, setShowReward] = useState(false);

    const handleBuyChest = async (chest: ChestConfig) => {
        if (!account) {
            alert('Please connect your wallet first!');
            return;
        }

        setActiveChest(chest);
        setIsOpening(true);
        setChestOpened(false);
        setShowReward(false);

        const gameResult = await buyChest(chest);

        if (gameResult) {
            // Animate chest opening
            setTimeout(() => {
                setChestOpened(true);
            }, 2000);

            setTimeout(() => {
                setIsOpening(false);
                setShowReward(true);
            }, 3500);
        } else {
            setActiveChest(null);
            setIsOpening(false);
        }
    };

    const handlePlayAgain = () => {
        setActiveChest(null);
        setShowReward(false);
        setIsOpening(false);
        setChestOpened(false);
        resetResult();
    };

    const handleReturnHome = () => {
        router.push('/?section=1');
    };

    return (
        <div
            className="min-h-screen relative overflow-hidden"
            style={{
                background: 'linear-gradient(to bottom, #87CEEB 0%, #87CEEB 60%, #98D8C8 60%, #98D8C8 100%)',
            }}
        >
            {/* Background Stars */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-white"
                    style={{
                        top: `${5 + Math.random() * 30}%`,
                        left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: 1 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                >
                    <Star size={12} fill="#FFF" />
                </motion.div>
            ))}

            {/* Sun */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    top: '8%',
                    right: '15%',
                    width: '60px',
                    height: '60px',
                    background: '#FFD700',
                    boxShadow: '0 0 20px rgba(255,215,0,0.5)',
                }}
                animate={{
                    boxShadow: ['0 0 20px rgba(255,215,0,0.5)', '0 0 40px rgba(255,215,0,0.8)', '0 0 20px rgba(255,215,0,0.5)'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Grass */}
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-[#4A7C2E] to-[#5A9C3E]" />

            {/* Header */}
            <div className="absolute top-4 left-4 z-20">
                <button
                    onClick={handleReturnHome}
                    className="bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-2 px-6 hover:-translate-y-1 active:translate-y-0 transition-all text-sm cursor-pointer"
                >
                    ← RETURN HOME
                </button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 p-4 pt-20">
                {/* Title */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-8"
                >
                    <h1
                        className="text-4xl md:text-5xl font-bold text-white mb-2"
                        style={{ textShadow: '4px 4px 0px #000' }}
                    >
                        LUCKY CHESTS
                    </h1>
                    <h2
                        className="text-2xl text-white"
                        style={{ textShadow: '3px 3px 0px #000' }}
                    >
                        GAME
                    </h2>
                </motion.div>

                {/* Wallet Warning */}
                {!account && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="max-w-md mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 rounded-xl text-center mb-8"
                    >
                        <p className="text-black font-bold text-sm mb-4">⚠️ Connect your wallet to play!</p>
                    </motion.div>
                )}

                {/* Chest Selection */}
                {!activeChest && account && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
                    >
                        {CHESTS.map((chest, index) => (
                            <motion.div
                                key={chest.id}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.15 }}
                                onClick={() => handleBuyChest(chest)}
                                className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl p-6 text-center cursor-pointer transition-all duration-150 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] min-w-[280px]"
                            >
                                <h2 className="text-lg font-bold text-black mb-4 whitespace-nowrap">{chest.name}</h2>

                                <div className="flex justify-center mb-4">
                                    <ChestIcon id={chest.id} />
                                </div>

                                <div className="bg-gray-100 border-2 border-black rounded-lg p-3 mb-4">
                                    <p className="text-xl font-bold text-black">{chest.price} SUI</p>
                                    <p className="text-sm text-gray-600">{chest.rateText}</p>
                                </div>

                                <button
                                    disabled={isLoading}
                                    className="w-full py-3 border-3 border-black rounded-lg font-bold text-white"
                                    style={{
                                        background: chest.color,
                                        boxShadow: '4px 4px 0px #000',
                                        textShadow: '2px 2px 0px #000',
                                    }}
                                >
                                    BUY NOW
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Opening Animation */}
            <AnimatePresence>
                {isOpening && activeChest && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50"
                    >
                        <motion.h2
                            className="text-2xl text-white font-bold mb-12"
                            style={{ textShadow: '3px 3px 0px #000' }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            {!chestOpened ? 'OPENING...' : ''}
                        </motion.h2>

                        <motion.div
                            animate={chestOpened ? {
                                scale: [1, 1.5, 0],
                                rotate: [0, 180, 360],
                                opacity: [1, 1, 0],
                            } : {
                                y: [0, -10, 0],
                                rotate: [-5, 5, -5],
                            }}
                            transition={chestOpened ? { duration: 1 } : { duration: 0.5, repeat: Infinity }}
                        >
                            <ChestIcon id={activeChest.id} size={200} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reward Modal */}
            <AnimatePresence>
                {showReward && result && activeChest && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl p-8 text-center max-w-md w-full"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                                className="text-6xl mb-4"
                            >
                                {result.isWin ? '🎉' : '😢'}
                            </motion.div>

                            <h2
                                className={`text-2xl font-bold mb-2 ${result.isWin ? 'text-green-500' : 'text-red-500'}`}
                            >
                                {result.rarity}
                            </h2>

                            <p className="text-4xl font-bold text-black mb-2">
                                {result.amount} SUI
                            </p>

                            <p className="text-gray-600 mb-6">
                                {result.multiplier} multiplier
                            </p>

                            <button
                                onClick={handlePlayAgain}
                                className="w-full bg-green-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-full py-3 px-8 hover:-translate-y-1 transition-all text-lg"
                            >
                                PLAY AGAIN
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
