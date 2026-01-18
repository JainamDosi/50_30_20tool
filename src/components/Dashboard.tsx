'use client';

import React from 'react';
import {
    Expense,
    BudgetData,
    MODES,
    CalculationResult,
    CURRENCIES
} from '@/lib/budget';
import { Navbar } from '@/components/Navbar';
import { ExpenseTable } from '@/components/ExpenseTable';
import { StatCard } from '@/components/StatCard';
import { ProgressBar } from '@/components/ProgressBar';
import { VarianceRow } from '@/components/VarianceRow';
import dynamic from 'next/dynamic';
import {
    TrendingUp, Activity,
    AlertCircle, Coins, PieChart as PieChartIcon,
    BarChart3, Scale, Calendar as CalendarIcon,
    ChevronLeft, ChevronRight, History
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Dynamic imports for Recharts
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const CHART_COLORS = ['#00ffa3', '#00d1ff', '#ffb700', '#ffffff'];

interface DashboardProps {
    data: BudgetData;
    setData: React.Dispatch<React.SetStateAction<BudgetData>>;
    results: CalculationResult;
    dateFilter: { month: number, year: number } | null;
    setDateFilter: React.Dispatch<React.SetStateAction<{ month: number, year: number } | null>>;
    timeSeriesData: { date: string, total: number }[];
    monthlyHistoryData: any[];
    currencySymbol: string;
    handleIncomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Dashboard({
    data,
    setData,
    results,
    dateFilter,
    setDateFilter,
    timeSeriesData,
    monthlyHistoryData,
    currencySymbol,
    handleIncomeChange
}: DashboardProps) {

    const addExpense = (newExpense: Omit<Expense, 'id'>) => {
        const expense: Expense = { ...newExpense, id: crypto.randomUUID() };
        setData((prev: any) => ({ ...prev, expenses: [...(prev.expenses || []), expense] }));
    };

    const deleteExpense = (id: string) => {
        setData((prev: any) => ({ ...prev, expenses: prev.expenses.filter((e: any) => e.id !== id) }));
    };

    const nextMonth = () => {
        if (!dateFilter) return;
        const nextDate = new Date(dateFilter.year, dateFilter.month + 1);
        setDateFilter({ month: nextDate.getMonth(), year: nextDate.getFullYear() });
    };

    const prevMonth = () => {
        if (!dateFilter) return;
        const prevDate = new Date(dateFilter.year, dateFilter.month - 1);
        setDateFilter({ month: prevDate.getMonth(), year: prevDate.getFullYear() });
    };

    const comparisonData = [
        { name: 'Needs', Spent: results.breakdown.needs, Target: results.ideal.needs },
        { name: 'Wants', Spent: results.breakdown.wants + results.breakdown.excess, Target: results.ideal.wants },
        { name: 'Savings', Spent: results.breakdown.savings, Target: results.ideal.savings },
    ];

    const distributionData = [
        { name: 'Needs', value: results.breakdown.needs },
        { name: 'Wants', value: results.breakdown.wants },
        { name: 'Excess', value: results.breakdown.excess },
        // Savings removed from outflow chart as per user request
    ].filter(d => d.value > 0);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pb-20"
        >
            <Navbar
                mode={data.mode}
                setMode={(m) => setData((prev: any) => ({ ...prev, mode: m }))}
                currency={data.currency}
                setCurrency={(c) => setData((prev: any) => ({ ...prev, currency: c }))}
                onClearData={() => {
                    if (confirm('Delete all data? This cannot be undone.')) {
                        setData({ income: 0, monthlyIncomes: {}, expenses: [], mode: '50-30-20', currency: 'USD' });
                    }
                }}
            />

            <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-8 space-y-8 md:space-y-12 animate-fade-in uppercase">
                {/* Dashboard Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row items-center justify-between gap-6"
                >
                    <div className="flex flex-col sm:flex-row items-center gap-3 glass p-1.5 md:p-2 rounded-2xl border-white/5 shadow-inner w-full lg:w-auto">
                        <button
                            onClick={() => setDateFilter(null)}
                            className={cn("w-full sm:w-auto px-6 py-2.5 text-[10px] font-black tracking-[0.2em] rounded-xl transition-all", !dateFilter ? "bg-white text-black shadow-lg" : "text-zinc-600 hover:text-zinc-400 font-sans")}
                        >
                            ALL TIME
                        </button>
                        <div className="hidden sm:block w-px h-6 bg-white/5 mx-1" />
                        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                            <button onClick={prevMonth} className="p-2 text-zinc-600 hover:text-white transition-colors shrink-0"><ChevronLeft className="w-4 h-4" /></button>
                            <button
                                onClick={() => !dateFilter && setDateFilter({ month: new Date().getMonth(), year: new Date().getFullYear() })}
                                className={cn("flex-1 sm:flex-none px-4 md:px-6 py-2.5 text-[10px] font-black tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 border", dateFilter ? "bg-white/[0.03] text-emerald-400 border-emerald-500/20" : "text-zinc-600 hover:text-zinc-400 border-transparent font-sans")}
                            >
                                <CalendarIcon className="w-4 h-4 shrink-0" />
                                <span className="truncate max-w-[120px] sm:max-w-none">
                                    {dateFilter ? new Date(dateFilter.year, dateFilter.month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'PICK MONTH'}
                                </span>
                            </button>
                            <button onClick={nextMonth} className="p-2 text-zinc-600 hover:text-white transition-colors shrink-0"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center gap-3 text-[10px] font-black text-zinc-600">
                            <History className="w-3.5 h-3.5" />
                            DATA SAVED
                        </div>
                    </div>
                </motion.div>

                {/* KPI Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <motion.div whileHover={{ y: -5 }} className="stat-card relative group overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="flex items-center justify-between relative z-10">
                            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] font-mono">Total Income</span>
                            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                <Coins className="w-4 h-4 text-emerald-400" />
                            </div>
                        </div>
                        <div className="relative z-10 mt-6">
                            <div className="flex items-baseline gap-2 group/input">
                                <span className="text-2xl font-black font-mono text-zinc-600 transition-colors group-hover/input:text-emerald-500">{currencySymbol}</span>
                                <input
                                    type="number"
                                    value={results.income || ''}
                                    onChange={handleIncomeChange}
                                    placeholder="0"
                                    className="bg-transparent text-4xl font-black font-mono text-white outline-none w-full placeholder:text-zinc-950 border-none p-0 focus:ring-0"
                                />
                            </div>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden flex-1 ring-1 ring-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: results.income > 0 ? '100%' : '0%' }}
                                        className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                                    />
                                </div>
                                <span className="text-[9px] font-black text-zinc-400 tracking-tighter shrink-0">{dateFilter ? 'MONTHLY' : 'TOTAL'}</span>
                            </div>
                        </div>
                    </motion.div>

                    <StatCard
                        label="Total Spent"
                        value={`${currencySymbol}${results.expensesTotal.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
                        icon={<TrendingUp className="w-4 h-4 text-sky-400" />}
                        subtext={results.expensesTotal > (results.income || 0) ? 'OVER BUDGET' : 'ON TRACK'}
                        trend={results.remaining < 0 ? 'down' : 'up'}
                        mono
                    />

                    <StatCard
                        label="Current Savings"
                        value={`${currencySymbol}${Math.abs(results.totalActualSavings).toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
                        icon={<Scale className="w-4 h-4 text-amber-500" />}
                        status={results.totalActualSavings < 0 ? 'LOW SAVINGS' : 'GOOD SAVINGS'}
                        statusColor={results.totalActualSavings < 0 ? 'text-amber-500' : 'text-emerald-400'}
                        mono
                    />
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                    <div className="xl:col-span-8 space-y-12">
                        {/* Area Chart: Time Series */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="stat-card md:col-span-2 !bg-transparent border-white/5 hover:border-emerald-500/10 !p-4 md:!p-8"
                        >
                            <div className="flex items-center justify-between mb-8 md:mb-12">
                                <h3 className="text-[10px] md:text-[11px] font-black font-mono text-white flex items-center gap-3 md:gap-4 tracking-tighter">
                                    <span className="w-4 md:w-8 h-px bg-emerald-500/30" />
                                    Daily Spending (30D)
                                </h3>
                            </div>
                            <div className="h-[200px] md:h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={timeSeriesData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00ffa3" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#00ffa3" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="10 10" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="date" stroke="#3f3f46" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(v) => v.split('-').slice(2).join('/')} tick={{ fill: '#a1a1aa', fontWeight: 900 }} />
                                        <YAxis stroke="#3f3f46" fontSize={8} tickLine={false} axisLine={false} tick={{ fill: '#a1a1aa', fontWeight: 900 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#111111', border: '1px solid #333333', borderRadius: '12px', padding: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}
                                            itemStyle={{ fontSize: '10px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#00ffa3' }}
                                            labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '10px', fontWeight: 900 }}
                                        />
                                        <Area type="monotone" dataKey="total" stroke="#00ffa3" strokeWidth={3} fill="url(#areaGradient)" animationDuration={2000} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="stat-card border-white/5 hover:border-sky-500/10 !p-6 md:!p-8">
                                <h3 className="text-[10px] font-black font-mono text-zinc-500 w-full mb-8 md:mb-10 tracking-[0.2em]">Spending Types</h3>
                                <div className="h-[200px] md:h-[240px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={distributionData}
                                                innerRadius={65}
                                                outerRadius={85}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                                cornerRadius={4}
                                            >
                                                {distributionData.map((entry) => (
                                                    <Cell
                                                        key={`cell-${entry.name}`}
                                                        fill={
                                                            entry.name === 'Needs' ? '#34d399' :
                                                                entry.name === 'Wants' ? '#38bdf8' :
                                                                    entry.name === 'Excess' ? '#fbbf24' : '#ffffff'
                                                        }
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                                itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 900 }}
                                                formatter={(v: any) => [`${currencySymbol}${Number(v).toFixed(0)}`, 'Outflow']}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-[9px] font-black text-zinc-400 tracking-[0.3em]">EXPENSES</span>
                                        <span className="text-3xl font-black font-mono text-white tracking-tighter">{results.expensesTotal.toFixed(0)}</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="stat-card border-white/5 hover:border-amber-500/10">
                                <h3 className="text-[10px] font-black font-mono text-zinc-500 w-full mb-10 tracking-[0.2em]">Month by Month</h3>
                                <div className="h-[240px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyHistoryData}>
                                            <defs>
                                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#00ffa3" stopOpacity={0.8} />
                                                    <stop offset="100%" stopColor="#00ffa3" stopOpacity={0.3} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                            <XAxis dataKey="month" stroke="#3f3f46" fontSize={9} tickLine={false} axisLine={false} tick={{ fill: '#a1a1aa', fontWeight: 900 }} />
                                            <YAxis hide />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#111111', border: '1px solid #333333', borderRadius: '8px' }}
                                                labelStyle={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8' }}
                                                itemStyle={{ color: '#00ffa3', fontWeight: 900 }}
                                            />
                                            <Bar dataKey="total" fill="url(#barGradient)" radius={[4, 4, 0, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {([
                                { title: 'NEEDS TREND', dataKey: 'needs', targetKey: 'targetNeeds', color: '#00ffa3', id: 'needs' },
                                { title: 'WANTS TREND', dataKey: 'wants', targetKey: 'targetWants', color: '#00d1ff', id: 'wants' },
                                { title: 'SAVINGS TREND', dataKey: 'savings', targetKey: 'targetSavings', color: '#ffb700', id: 'savings' }
                            ] as const).map((chart) => (
                                <div key={chart.id} className="stat-card border-white/5 hover:border-emerald-500/10">
                                    <h3 className="text-[10px] font-black font-mono text-zinc-500 w-full mb-6 tracking-[0.2em] uppercase">{chart.title}</h3>
                                    <div className="h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={monthlyHistoryData.map(item => {
                                                const monthKey = item.month;
                                                const monthIncome = data.monthlyIncomes?.[monthKey] ?? data.income;
                                                const ratios = MODES[data.mode];
                                                return {
                                                    ...item,
                                                    targetNeeds: monthIncome * ratios.needs,
                                                    targetWants: monthIncome * ratios.wants,
                                                    targetSavings: monthIncome * ratios.savings
                                                };
                                            })} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id={`${chart.id}Gradient`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor={chart.color} stopOpacity={1} />
                                                        <stop offset="100%" stopColor={chart.color} stopOpacity={0.5} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="5 5" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                                <XAxis
                                                    dataKey="month"
                                                    stroke="#3f3f46"
                                                    fontSize={9}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tick={{ fill: '#a1a1aa', fontWeight: 900 }}
                                                    tickFormatter={(v) => {
                                                        const [y, m] = v.split('-');
                                                        return `${new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString(undefined, { month: 'short' })}`
                                                    }}
                                                    xAxisId="0"
                                                />
                                                <XAxis dataKey="month" hide xAxisId="1" />
                                                <YAxis stroke="#3f3f46" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} tick={{ fill: '#a1a1aa', fontWeight: 900 }} />
                                                <Tooltip
                                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                                    itemStyle={{ fontSize: '11px', fontWeight: 900, fontFamily: 'var(--font-mono)' }}
                                                    labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '10px', fontWeight: 900 }}
                                                    formatter={(value, name) => [
                                                        <span key="val" style={{ color: name === 'Actual' ? '#fff' : 'rgba(255,255,255,0.5)' }}>{value}</span>,
                                                        name
                                                    ]}
                                                />
                                                <Bar name="Target" dataKey={chart.targetKey} xAxisId="0" fill={chart.color} fillOpacity={0.1} radius={[4, 4, 4, 4]} barSize={32} />
                                                <Bar name="Actual" dataKey={chart.dataKey} xAxisId="1" fill={`url(#${chart.id}Gradient)`} radius={[4, 4, 4, 4]} barSize={12} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <ExpenseTable
                            expenses={data.expenses}
                            currency={data.currency}
                            onAddExpense={addExpense}
                            onDeleteExpense={deleteExpense}
                        />
                    </div>

                    <aside className="xl:col-span-4 space-y-8">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="stat-card !p-8 space-y-12 border-emerald-500/10 bg-emerald-500/[0.01] overflow-hidden relative shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] -mr-16 -mt-16" />
                            <div className="flex items-center justify-between relative z-10">
                                <h3 className="text-[11px] font-black font-mono text-white tracking-[0.3em] flex items-center gap-4">
                                    <Scale className="w-5 h-5 text-emerald-500" />
                                    Budget Status
                                </h3>
                            </div>

                            <div className="space-y-10 relative z-10">
                                <ProgressBar
                                    label="Monthly Needs"
                                    current={results.breakdown.needs}
                                    max={results.ideal.needs}
                                    color="bg-emerald-500"
                                    currency={currencySymbol}
                                    percentage={results.percentages.needs}
                                    modePercentage={MODES[data.mode].needs * 100}
                                />
                                <ProgressBar
                                    label="Wants & Extra"
                                    current={results.breakdown.wants + results.breakdown.excess}
                                    max={results.ideal.wants}
                                    color="bg-sky-500"
                                    currency={currencySymbol}
                                    percentage={results.percentages.wants + results.percentages.excess}
                                    modePercentage={MODES[data.mode].wants * 100}
                                />
                                <ProgressBar
                                    label="Savings & Growth"
                                    current={results.totalActualSavings}
                                    max={results.ideal.savings}
                                    color="bg-white"
                                    currency={currencySymbol}
                                    percentage={results.percentages.savings}
                                    modePercentage={MODES[data.mode].savings * 100}
                                    overflowColor="bg-emerald-500"
                                    partyMode={true}
                                />
                            </div>

                            <div className="pt-10 border-t border-white/5 relative z-10">
                                <div className="p-6 rounded-2xl bg-black border border-white/5 relative group">
                                    <div className="flex items-start gap-5">
                                        <AlertCircle className="w-5 h-5 text-emerald-600 mt-1 shrink-0" />
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">BUDGET TIP</p>
                                            <p className="text-sm text-zinc-500 leading-relaxed font-medium lowercase tracking-tight">
                                                your savings rate is <span className="text-white font-black">{results.savingsRate.toFixed(1)}%</span>.
                                                for the <span className="text-emerald-500 font-black">{data.mode}</span> plan, you should aim for <span className="text-emerald-400 font-black">{(MODES[data.mode].savings * 100).toFixed(0)}%</span>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="stat-card !p-8 space-y-8">
                            <h3 className="text-[10px] font-black font-mono text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-4">
                                <PieChartIcon className="w-5 h-5" />
                                Goal Tracking
                            </h3>
                            <div className="space-y-4">
                                <VarianceRow label="Needs" variance={results.deviations.needs} currency={currencySymbol} />
                                <VarianceRow label="Wants" variance={results.deviations.wants} currency={currencySymbol} />
                                <VarianceRow label="Wealth" variance={results.deviations.savings} currency={currencySymbol} invert={true} />
                            </div>
                        </motion.div>
                    </aside>
                </div>
            </main>
        </motion.div>
    );
}
