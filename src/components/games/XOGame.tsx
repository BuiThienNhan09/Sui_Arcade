'use client';

import { useState, useEffect, useCallback } from 'react';
import XOBoard from './XOBoard';
import ResultModal from './ResultModal';
import {
    Board,
    CellValue,
    GameResult,
    GameConfig,
    createBoard,
    makeMove,
    getGameResult
} from '@/lib/xoLogic';
import { getAIMove } from '@/lib/xoAI';

interface XOGameProps {
    config: GameConfig;
    onGameEnd: (result: GameResult) => void;
    onGoBack: () => void;
}

export default function XOGame({ config, onGameEnd, onGoBack }: XOGameProps) {
    const [board, setBoard] = useState<Board>(() => createBoard(config.size));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [gameResult, setGameResult] = useState<GameResult>('ongoing');
    const [isThinking, setIsThinking] = useState(false);

    const playerSymbol: CellValue = 'X';
    const aiSymbol: CellValue = 'O';

    // Check game result after each move
    const checkResult = useCallback((currentBoard: Board): GameResult => {
        return getGameResult(currentBoard, config.winLength, playerSymbol);
    }, [config.winLength]);

    // AI move logic
    useEffect(() => {
        if (!isPlayerTurn && gameResult === 'ongoing') {
            setIsThinking(true);

            // Add small delay to make AI feel more natural
            const timer = setTimeout(() => {
                const aiMove = getAIMove(board, config.winLength, aiSymbol, playerSymbol);

                if (aiMove) {
                    const [row, col] = aiMove;
                    const newBoard = makeMove(board, row, col, aiSymbol);
                    setBoard(newBoard);

                    const result = checkResult(newBoard);
                    if (result !== 'ongoing') {
                        setGameResult(result);
                        onGameEnd(result);
                    } else {
                        setIsPlayerTurn(true);
                    }
                }

                setIsThinking(false);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isPlayerTurn, board, gameResult, config.winLength, checkResult, onGameEnd]);

    // Handle player move
    const handleCellClick = (row: number, col: number) => {
        if (!isPlayerTurn || gameResult !== 'ongoing' || board[row][col] !== null) {
            return;
        }

        const newBoard = makeMove(board, row, col, playerSymbol);
        setBoard(newBoard);

        const result = checkResult(newBoard);
        if (result !== 'ongoing') {
            setGameResult(result);
            onGameEnd(result);
        } else {
            setIsPlayerTurn(false);
        }
    };

    // Reset game
    const handlePlayAgain = () => {
        setBoard(createBoard(config.size));
        setIsPlayerTurn(true);
        setGameResult('ongoing');
    };

    // Get payout based on result
    const getPayout = (): number => {
        if (gameResult === 'win') return config.winPayout;
        if (gameResult === 'tie') return config.tiePayout;
        return 0;
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Turn Indicator */}
            <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-2 rounded-full">
                <span className="text-black font-bold text-sm">
                    {isThinking ? 'AI is thinking...' : isPlayerTurn ? 'Your turn (X)' : 'AI turn (O)'}
                </span>
            </div>

            {/* Game Board */}
            <XOBoard
                board={board}
                onCellClick={handleCellClick}
                disabled={!isPlayerTurn || gameResult !== 'ongoing'}
            />

            {/* Result Modal */}
            {gameResult !== 'ongoing' && (
                <ResultModal
                    result={gameResult}
                    payout={getPayout()}
                    onPlayAgain={handlePlayAgain}
                    onGoBack={onGoBack}
                />
            )}
        </div>
    );
}
