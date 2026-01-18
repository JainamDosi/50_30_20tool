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

export function VarianceRow({ label, variance, currency, invert = false }: VarianceRowProps & { invert?: boolean }) {
    const isPositive = variance > 1;
    const isNegative = variance < -1;

    let colorClass = "text-zinc-400";
    let statusText = "OPTIMAL";

    if (invert) {
        // Savings Logic: Positive is Good (Green), Negative is Bad (Amber)
        if (isPositive) {
            colorClass = "text-emerald-400"; // Good
            statusText = "SURPLUS";
        } else if (isNegative) {
            colorClass = "text-amber-500"; // Bad
            statusText = "SHORTFALL";
        }
    } else {
        // Expense Logic: Positive is Bad (Amber), Negative is Good (Green)
        if (isPositive) {
            colorClass = "text-amber-500"; // Bad
            statusText = "OVERSPENT";
        } else if (isNegative) {
            colorClass = "text-emerald-400"; // Good
            statusText = "REMAINING";
        }
    }

    return (
        <div className="flex items-center justify-between p-5 rounded-2xl bg-black border border-white/5 hover:border-emerald-500/20 transition-all group cursor-default">
            <span className="text-[10px] font-black font-mono text-zinc-400 uppercase tracking-[0.2em] group-hover:text-emerald-500/50 transition-colors">{label}</span>
            <div className="text-right">
                <p className={cn("text-sm font-black font-mono tracking-tighter", colorClass)}>
                    {isPositive ? '+' : ''}{currency}{Math.abs(Math.round(variance)).toLocaleString()}
                </p>
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-zinc-500 mt-1">
                    {statusText}
                </p>
            </div>
        </div>
    );
}
