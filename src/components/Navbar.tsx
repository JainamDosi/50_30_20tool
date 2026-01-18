'use client';

import React from 'react';
import { BudgetMode, Currency, CURRENCIES } from '@/lib/budget';
import { LayoutDashboard, Trash2, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
    mode: BudgetMode;
    setMode: (mode: BudgetMode) => void;
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    onClearData: () => void;
    isLanding?: boolean;
    onEnterDashboard?: () => void;
}

export function Navbar({ mode, setMode, currency, setCurrency, onClearData, isLanding, onEnterDashboard }: NavbarProps) {
    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-black/60 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Logo Area */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 cursor-pointer self-start sm:self-auto"
                        onClick={() => window.location.href = '/'}
                    >
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group overflow-hidden">
                            <svg viewBox="0 0 40 40" className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform duration-500">
                                <path
                                    fill="currentColor"
                                    d="M8,8 L8,32 L20,32 C26.627,32 30,28.5 30,25 C30,22.5 28.5,21 26,20.5 C28,19.5 29,18 29,16 C29,11.5 25.5,8 20,8 L8,8 Z M12,12 L19,12 C22,12 24,13 24,15 C24,17 22,18 19,18 L12,18 L12,12 Z M12,21 L20,21 C23,21 25,22 25,25 C25,27.5 22.5,28 20,28 L12,28 L12,21 Z"
                                    opacity="0.9"
                                />
                                <path
                                    fill="currentColor"
                                    d="M4,10 L4,30 L6,30 L6,10 L4,10 Z"
                                    opacity="0.5"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-bold font-sans tracking-tighter text-white">BetterBudget</h1>
                            <p className="text-[8px] md:text-[9px] text-zinc-600 font-black tracking-[0.3em] uppercase">Simple Money Tracking</p>
                        </div>
                    </motion.div>

                    {/* Controls */}
                    {!isLanding ? (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 md:gap-3 glass p-1 rounded-2xl w-full sm:w-auto overflow-x-auto no-scrollbar"
                        >
                            <div className="relative group shrink-0">
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value as Currency)}
                                    className="appearance-none bg-transparent pl-3 pr-8 py-1.5 text-[9px] font-black font-mono text-zinc-400 hover:text-emerald-400 focus:outline-none cursor-pointer transition-colors uppercase tracking-widest"
                                >
                                    {Object.keys(CURRENCIES).map((c) => (
                                        <option key={c} value={c} className="bg-[#050505] text-zinc-300">
                                            {c} {CURRENCIES[c as Currency]}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Settings2 className="w-2.5 h-2.5 text-zinc-600" />
                                </div>
                            </div>

                            <div className="w-px h-4 bg-white/5 shrink-0" />

                            <div className="flex bg-black/40 rounded-xl p-0.5 border border-white/5 shrink-0">
                                {(['50-30-20', '65-20-15'] as BudgetMode[]).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMode(m)}
                                        className={`px-3 py-1 text-[9px] font-black font-mono rounded-lg transition-all duration-500 uppercase tracking-tighter ${mode === m
                                            ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)] border border-emerald-500/20'
                                            : 'text-zinc-600 hover:text-zinc-400'
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>

                            <div className="w-px h-4 bg-white/5 shrink-0" />

                            <button
                                onClick={onClearData}
                                className="p-2 text-zinc-600 hover:text-amber-500 hover:bg-amber-500/5 rounded-xl transition-all group shrink-0"
                                title="Clear All Data"
                            >
                                <Trash2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onEnterDashboard}
                            className="px-5 py-2 md:px-6 md:py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all"
                        >
                            Open Dashboard
                        </motion.button>
                    )}
                </div>
            </div>
        </nav>
    );
}
