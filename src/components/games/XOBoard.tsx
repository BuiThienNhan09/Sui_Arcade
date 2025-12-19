'use client';

import { Board } from '@/lib/xoLogic';
import XOCell from './XOCell';

interface XOBoardProps {
    board: Board;
    onCellClick: (row: number, col: number) => void;
    disabled: boolean;
}

export default function XOBoard({ board, onCellClick, disabled }: XOBoardProps) {
    const size = board.length;

    // Determine cell size based on board size
    const cellSize: 'sm' | 'md' | 'lg' = size <= 3 ? 'lg' : size <= 6 ? 'md' : 'sm';

    // Grid gap based on size
    const gapClass = size <= 3 ? 'gap-2' : size <= 6 ? 'gap-1' : 'gap-0.5';

    return (
        <div
            className={`
        inline-grid ${gapClass}
        bg-black p-2
        border-4 border-black
        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
      `}
            style={{
                gridTemplateColumns: `repeat(${size}, auto)`,
            }}
        >
            {board.map((row, rowIdx) =>
                row.map((cell, colIdx) => (
                    <XOCell
                        key={`${rowIdx}-${colIdx}`}
                        value={cell}
                        onClick={() => onCellClick(rowIdx, colIdx)}
                        disabled={disabled}
                        size={cellSize}
                    />
                ))
            )}
        </div>
    );
}
