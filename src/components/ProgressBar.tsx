'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ProgressBarProps {
    label: string;
    current: number;
    max: number;
    color: string;
    currency: string;
    percentage: number;
    modePercentage: number;
}

export function ProgressBar({ label, current, max, color, currency, percentage, modePercentage }: ProgressBarProps) {
    const isOver = current > max;
    const barWidth = Math.min(100, Math.max(0, (current / (max || 1)) * 100));

    return (
        <div className="group space-y-4">
            <div className="flex justify-between items-end">
                <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] group-hover:text-zinc-300 transition-colors shrink-0">{label}</p>
                    <p className="text-lg font-black font-mono text-white tracking-tighter">
                        {percentage.toFixed(0)}% <span className="text-zinc-700 text-[11px] ml-1 tracking-normal font-medium">({currency}{Math.round(current).toLocaleString()})</span>
                    </p>
                </div>
                <div className="text-right pb-1">
                    <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mb-1 leading-none">TARGET</p>
                    <p className="text-xs font-black font-mono text-zinc-500">{modePercentage}%</p>
                </div>
            </div>
            <div className="h-2 w-full bg-white/[0.03] rounded-full relative ring-1 ring-white/[0.05] overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn("h-full rounded-full shadow-[0_0_20px_rgba(255,255,255,0.05)]", isOver ? 'bg-amber-500' : color)}
                />
                <div className="absolute top-0 bottom-0 w-px bg-white/20 z-10 pointer-events-none" style={{ left: `${(modePercentage)}%` }} />
            </div>
        </div>
    );
}
