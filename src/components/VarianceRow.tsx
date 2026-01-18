'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface VarianceRowProps {
    label: string;
    variance: number;
    currency: string;
}

export function VarianceRow({ label, variance, currency }: VarianceRowProps) {
    const isPositive = variance > 1;
    const isNegative = variance < -1;

    return (
        <div className="flex items-center justify-between p-5 rounded-2xl bg-black border border-white/5 hover:border-emerald-500/20 transition-all group cursor-default">
            <span className="text-[10px] font-black font-mono text-zinc-500 uppercase tracking-[0.2em] group-hover:text-emerald-500/50 transition-colors">{label}</span>
            <div className="text-right">
                <p className={cn("text-sm font-black font-mono tracking-tighter", isPositive ? "text-amber-500" : isNegative ? "text-emerald-500" : "text-zinc-600")}>
                    {isPositive ? '+' : ''}{currency}{Math.abs(Math.round(variance)).toLocaleString()}
                </p>
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-zinc-700 mt-1">
                    {isPositive ? 'DEVIATION' : isNegative ? 'UNDERLOAD' : 'OPTIMAL'}
                </p>
            </div>
        </div>
    );
}
