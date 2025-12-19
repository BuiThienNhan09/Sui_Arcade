'use client';

import { CellValue } from '@/lib/xoLogic';

interface XOCellProps {
    value: CellValue;
    onClick: () => void;
    disabled: boolean;
    size: 'sm' | 'md' | 'lg';
}

export default function XOCell({ value, onClick, disabled, size }: XOCellProps) {
    const sizeClasses = {
        sm: 'w-8 h-8 text-lg',      // 9x9
        md: 'w-12 h-12 text-2xl',   // 6x6
        lg: 'w-16 h-16 text-4xl',   // 3x3
    };

    const cellSize = sizeClasses[size];

    return (
        <button
            onClick={onClick}
            disabled={disabled || value !== null}
            className={`
        ${cellSize}
        bg-white border-4 border-black
        font-bold flex items-center justify-center
        transition-all duration-150
        ${!disabled && value === null ? 'hover:bg-gray-100 hover:scale-105 cursor-pointer' : 'cursor-default'}
        ${value === 'X' ? 'text-red-500' : value === 'O' ? 'text-blue-500' : 'text-transparent'}
        shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
      `}
        >
            {value || '·'}
        </button>
    );
}
