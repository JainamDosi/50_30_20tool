'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface StatCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    subtext?: string;
    trend?: 'up' | 'down';
    status?: string;
    statusColor?: string;
    mono?: boolean;
}

export function StatCard({ label, value, icon, subtext, trend, status, statusColor, mono }: StatCardProps) {
    return (
        <motion.div whileHover={{ y: -6 }} className="stat-card !p-6 md:!p-8 group shadow-2xl">
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <span className="text-zinc-500 text-[10px] font-black font-mono uppercase tracking-[0.3em]">{label}</span>
                <div className="p-2 md:p-2.5 bg-black rounded-xl border border-white/5 shadow-inner transition-colors group-hover:border-white/10">{icon}</div>
            </div>
            <div className="flex items-baseline gap-2 md:gap-3">
                <span className={cn("text-3xl md:text-4xl font-black tracking-tighter text-white", mono && "font-mono")}>{value}</span>
                {trend && (
                    <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className={cn("text-xs font-black", trend === 'up' ? 'text-emerald-500' : 'text-amber-500')}>
                        {trend === 'up' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </motion.span>
                )}
            </div>
            {(subtext || status) && (
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                    {subtext && <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{subtext}</p>}
                    {status && <p className={cn("text-[9px] uppercase tracking-[0.3em] font-black px-2 py-0.5 rounded bg-white/5", statusColor)}>{status}</p>}
                </div>
            )}
        </motion.div>
    );
}
