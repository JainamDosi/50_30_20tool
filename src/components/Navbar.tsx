'use client';

import React from 'react';
import { BudgetMode, Currency, CURRENCIES } from '@/lib/budget';
import { LayoutDashboard, Trash2, Settings2, ShieldCheck } from 'lucide-react';
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
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo Area */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => window.location.href = '/'}
                    >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group">
                            <ShieldCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold font-sans tracking-tighter text-white">RatioBudget</h1>
                            <p className="text-[9px] text-zinc-600 font-black tracking-[0.3em] uppercase">Simple Money Tracking</p>
                        </div>
                    </motion.div>

                    {/* Controls */}
                    {!isLanding ? (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 glass p-1.5 rounded-2xl"
                        >
                            <div className="relative group">
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value as Currency)}
                                    className="appearance-none bg-transparent pl-4 pr-10 py-2 text-[10px] font-black font-mono text-zinc-400 hover:text-emerald-400 focus:outline-none cursor-pointer transition-colors uppercase tracking-widest"
                                >
                                    {Object.keys(CURRENCIES).map((c) => (
                                        <option key={c} value={c} className="bg-[#050505] text-zinc-300">
                                            {c} {CURRENCIES[c as Currency]}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Settings2 className="w-3 h-3 text-zinc-600" />
                                </div>
                            </div>

                            <div className="w-px h-5 bg-white/5" />

                            <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
                                {(['50-30-20', '65-20-15'] as BudgetMode[]).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMode(m)}
                                        className={`px-4 py-1.5 text-[10px] font-black font-mono rounded-lg transition-all duration-500 uppercase tracking-tighter ${mode === m
                                            ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)] border border-emerald-500/20'
                                            : 'text-zinc-600 hover:text-zinc-400'
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>

                            <div className="w-px h-5 bg-white/5" />

                            <button
                                onClick={onClearData}
                                className="p-2.5 text-zinc-600 hover:text-amber-500 hover:bg-amber-500/5 rounded-xl transition-all group"
                                title="Clear All Data"
                            >
                                <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onEnterDashboard}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all"
                        >
                            Open Dashboard
                        </motion.button>
                    )}
                </div>
            </div>
        </nav>
    );
}
