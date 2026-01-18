'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Layers, Gauge, ShieldCheck, Activity, TrendingUp, Scale } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface LandingPageProps {
    onEnter?: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
    const router = useRouter();

    const handleEnter = () => {
        if (onEnter) onEnter();
        router.push('/dashboard');
    };
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen px-4 py-12 md:py-20 relative overflow-hidden"
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-emerald-500/5 rounded-full blur-[80px] md:blur-[140px] pointer-events-none" />

            {/* Decorative background grid/lines */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 50 Q 25 45, 50 50 T 100 50" fill="none" stroke="url(#lineGradient)" strokeWidth="0.1" />
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="50%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-center space-y-8 md:space-y-10 max-w-5xl z-10"
            >
                <div className="inline-flex items-center gap-3 px-4 py-2 md:px-5 md:py-2.5 rounded-full glass border-2 border-emerald-500/30 text-emerald-400 text-[8px] md:text-[10px] font-black tracking-[0.4em] uppercase shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                    <Zap className="w-3 h-3 fill-emerald-400 animate-pulse" />
                    Ready
                </div>

                <h1 className="text-5xl md:text-9xl font-black font-sans tracking-tight leading-[0.85] text-white">
                    BETTER <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-sky-400 to-amber-500">BUDGET.</span>
                </h1>

                <p className="text-zinc-500 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed tracking-tight px-4 md:px-0">
                    A simple way to manage your money. Organize your spending with the proven <span className="text-white border-b border-emerald-500/50">50-30-20</span> rule.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 pt-8 md:pt-12">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(16, 185, 129, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEnter}
                        className="group flex items-center gap-4 px-10 py-5 md:px-12 md:py-6 bg-white text-black text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] rounded-[2rem] transition-all w-full sm:w-auto justify-center"
                    >
                        Open Dashboard
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </motion.button>

                    <div className="flex items-center gap-8 md:gap-10 text-[9px] md:text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">
                        <div className="flex flex-col items-center gap-2 group">
                            <Layers className="w-5 h-5 md:w-6 md:h-6 text-emerald-500/30 group-hover:text-emerald-400 transition-colors" />
                            Smart Tracking
                        </div>
                        <div className="flex flex-col items-center gap-2 group">
                            <Gauge className="w-5 h-5 md:w-6 md:h-6 text-sky-500/30 group-hover:text-sky-400 transition-colors" />
                            Save More
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Floating Visual Elements */}
            <div className="hidden lg:block">
                <FloatingCard
                    className="top-[12%] left-[8%] -rotate-12 border-[1.5px]! border-emerald-200!"
                    title="Needs"
                    value="50.0%"
                    color="text-emerald-400"
                    icon={<ShieldCheck className="w-4 h-4" />}
                    delay={0}
                />
                <FloatingCard
                    className="bottom-[18%] left-[12%] rotate-3"
                    title="Auto Sync"
                    value="Active"
                    color="text-sky-400"
                    icon={<Activity className="w-4 h-4" />}
                    delay={1}
                />
                <FloatingCard
                    className="top-[22%] right-[10%] rotate-12"
                    title="Savings"
                    value="20.0%"
                    color="text-white"
                    icon={<TrendingUp className="w-4 h-4" />}
                    delay={1.5}
                />
                <FloatingCard
                    className="bottom-[25%] right-[15%] -rotate-6"
                    title="Plan"
                    value="Balanced"
                    color="text-amber-500"
                    icon={<Scale className="w-4 h-4" />}
                    delay={0.5}
                />
            </div>
        </motion.div>
    );
}

function FloatingCard({ className, title, value, color, icon, delay }: any) {
    return (
        <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay }}
            className={cn("absolute glass p-5 rounded-2xl border-white/5 shadow-2xl z-10 w-48", className)}
        >
            <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">{title}</span>
                <div className="p-1 px-2 rounded-md bg-white/5 border border-white/5 text-zinc-500">{icon}</div>
            </div>
            <div className={cn("text-2xl font-black font-mono tracking-tighter", color)}>{value}</div>
        </motion.div>
    );
}
