'use client';

import React, { useState } from 'react';
import { Expense, ExpenseCategory, Currency, CATEGORY_ICONS, CATEGORY_COLORS, CURRENCIES } from '@/lib/budget';
import { Plus, Trash2, Search, Calendar, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpenseTableProps {
    expenses: Expense[];
    currency: Currency;
    onAddExpense: (expense: Omit<Expense, 'id'>) => void;
    onDeleteExpense: (id: string) => void;
}

export function ExpenseTable({ expenses = [], currency, onAddExpense, onDeleteExpense }: ExpenseTableProps) {
    const [newAmount, setNewAmount] = useState('');
    const [newComment, setNewComment] = useState('');
    const [newCategory, setNewCategory] = useState<ExpenseCategory>('Need');
    const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const amt = parseFloat(newAmount);
        if (isNaN(amt) || amt <= 0) return;

        onAddExpense({
            amount: amt,
            description: newComment.trim() || undefined,
            category: newCategory,
            date: new Date(newDate).toISOString()
        });

        setNewAmount('');
        setNewComment('');
        setNewCategory('Need');
        setNewDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-black font-mono text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-4">
                    <span className="w-8 h-px bg-emerald-500/30" />
                    Recent Transactions
                    <span className="text-[10px] bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded text-emerald-400 font-bold">{expenses.length}</span>
                </h2>
            </div>

            <div className="stat-card !p-0 overflow-hidden border border-white/5 group/container">
                {/* Form Section */}
                <div className="p-6 border-b border-white/5 bg-emerald-500/[0.01]">
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Amount</label>
                            <div className="relative group/input">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs group-focus-within/input:text-emerald-400 transition-colors">{CURRENCIES[currency]}</span>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={newAmount}
                                    onChange={(e) => setNewAmount(e.target.value)}
                                    className="w-full bg-black border border-white/5 rounded-xl py-2.5 pl-8 pr-3 text-sm font-mono text-white placeholder:text-zinc-800 focus:outline-none focus:border-emerald-500/30 focus:bg-emerald-500/[0.02] transition-all shadow-inner"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Description</label>
                            <input
                                type="text"
                                placeholder="What for?..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full bg-black border border-white/5 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-emerald-500/30 focus:bg-emerald-500/[0.02] transition-all shadow-inner"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Date</label>
                            <input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="w-full bg-black border border-white/5 rounded-xl py-2.5 px-4 text-xs text-zinc-500 focus:outline-none focus:border-emerald-500/30 transition-all appearance-none date-input-dark"
                            />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Category</label>
                            <select
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                                className="w-full bg-black border border-white/5 rounded-xl py-2.5 px-4 text-xs text-zinc-400 focus:outline-none focus:border-emerald-500/30 cursor-pointer appearance-none shadow-inner"
                            >
                                <option value="Need">Needs</option>
                                <option value="Want">Wants</option>
                                <option value="Saving/Invested">Savings</option>
                                <option value="Excess">Extra</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={!newAmount}
                                className="w-full bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(255,255,255,0.05)] hover:bg-emerald-400 hover:text-black"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Save
                            </motion.button>
                        </div>
                    </form>
                </div>

                {/* Table Headers */}
                <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-white/[0.03] border-b border-white/10 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-4">Description</div>
                    <div className="col-span-2 text-center">Date</div>
                    <div className="col-span-3 text-center">Category</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                {/* List Body */}
                <div className="divide-y divide-white/[0.02] max-h-[500px] overflow-y-auto custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {expenses.length === 0 ? (
                            <div className="py-24 flex flex-col items-center justify-center text-zinc-700">
                                <Search className="w-8 h-8 mb-4 opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">No Transactions Found</p>
                            </div>
                        ) : (
                            [...expenses]
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((expense, idx) => {
                                    const Icon = CATEGORY_ICONS[expense.category];
                                    const colorClass = CATEGORY_COLORS[expense.category];
                                    const dateStr = new Date(expense.date).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: '2-digit' });

                                    return (
                                        <motion.div
                                            key={expense.id}
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-white/[0.01] transition-all group"
                                        >
                                            <div className="col-span-2 font-mono font-black text-white text-sm">
                                                {Number(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                                <span className="text-zinc-500 text-[10px] ml-1 uppercase">{currency}</span>
                                            </div>
                                            <div className="col-span-4 text-[11px] text-zinc-400 italic truncate group-hover:text-zinc-200 transition-colors">
                                                {expense.description || <span className="opacity-20 not-italic">no description</span>}
                                            </div>
                                            <div className="col-span-2 text-[10px] font-mono text-zinc-600 text-center font-bold">
                                                {dateStr}
                                            </div>
                                            <div className="col-span-3 flex justify-center">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border border-white/5 bg-white/[0.02] shadow-sm ${colorClass}`}>
                                                    <Icon className="w-2.5 h-2.5 opacity-60" />
                                                    {expense.category}
                                                </span>
                                            </div>
                                            <div className="col-span-1 text-right">
                                                <button
                                                    onClick={() => onDeleteExpense(expense.id)}
                                                    className="p-2 text-zinc-800 hover:text-amber-500 hover:bg-amber-500/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <style jsx>{`
                .date-input-dark::-webkit-calendar-picker-indicator {
                    filter: invert(0.8);
                    opacity: 0.1;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
