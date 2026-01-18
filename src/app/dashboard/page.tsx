'use client';

import React, { useMemo, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
    calculateBudget,
    BudgetData,
    CURRENCIES,
    groupExpensesByMonth,
    groupExpensesByDay
} from '@/lib/budget';
import { Dashboard } from '@/components/Dashboard';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const [data, setData, initialized] = useLocalStorage<BudgetData>('ratio-budget-v2', {
        income: 0,
        monthlyIncomes: {},
        expenses: [],
        mode: '50-30-20',
        currency: 'USD'
    });

    const [dateFilter, setDateFilter] = useState<{ month: number, year: number } | null>(() => {
        const now = new Date();
        return { month: now.getMonth(), year: now.getFullYear() };
    });

    const results = useMemo(() => {
        return calculateBudget(data, dateFilter?.month, dateFilter?.year);
    }, [data, dateFilter]);

    const timeSeriesData = useMemo(() => {
        return groupExpensesByDay(data.expenses || [], 30);
    }, [data.expenses]);

    const monthlyHistoryData = useMemo(() => {
        return groupExpensesByMonth(data.expenses || []);
    }, [data.expenses]);

    const currencySymbol = CURRENCIES[data.currency] || '$';

    const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        const amt = isNaN(value) ? 0 : value;

        if (dateFilter) {
            const key = `${dateFilter.year}-${String(dateFilter.month + 1).padStart(2, '0')}`;
            setData(prev => ({
                ...(prev || {}),
                monthlyIncomes: {
                    ...(prev?.monthlyIncomes || {}),
                    [key]: amt
                },
                income: amt
            }));
        } else {
            setData(prev => ({ ...prev, income: amt }));
        }
    };

    if (!initialized) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} className="text-emerald-500 font-mono text-[10px] tracking-[0.5em] uppercase">Loading...</motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-[#ededed] font-sans selection:bg-emerald-500/30">
            <div className="mesh-bg opacity-40" />
            <Dashboard
                data={data}
                setData={setData}
                results={results}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                timeSeriesData={timeSeriesData}
                monthlyHistoryData={monthlyHistoryData}
                currencySymbol={currencySymbol}
                handleIncomeChange={handleIncomeChange}
            />
        </div>
    );
}
