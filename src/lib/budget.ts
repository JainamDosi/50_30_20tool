import { LucideIcon, Wallet, Star, TrendingUp, PiggyBank } from 'lucide-react';

export type BudgetMode = '50-30-20' | '65-20-15';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY';
export type ExpenseCategory = 'Need' | 'Want' | 'Excess' | 'Saving/Invested';

export interface Expense {
    id: string;
    amount: number;
    description?: string;
    category: ExpenseCategory;
    date: string;
}

export interface BudgetData {
    income: number;
    monthlyIncomes?: Record<string, number>;
    expenses: Expense[];
    mode: BudgetMode;
    currency: Currency;
}

export interface BudgetRatios {
    needs: number;
    wants: number;
    savings: number;
}

export const MODES: Record<BudgetMode, BudgetRatios> = {
    '50-30-20': { needs: 0.5, wants: 0.3, savings: 0.2 },
    '65-20-15': { needs: 0.65, wants: 0.2, savings: 0.15 },
};

export const CATEGORY_ICONS: Record<ExpenseCategory, LucideIcon> = {
    'Need': Wallet,
    'Want': Star,
    'Excess': TrendingUp,
    'Saving/Invested': PiggyBank
};

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
    'Need': 'text-emerald-400',       // Cyber Emerald
    'Want': 'text-sky-400',           // Azure Blue
    'Excess': 'text-amber-500',       // Bold Amber
    'Saving/Invested': 'text-white'   // Titan White/Gold effect
};

export const CURRENCIES: Record<Currency, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'JPY': '¥'
};

export interface CalculationResult {
    totalSpent: number;
    remaining: number;
    income: number;
    expensesTotal: number;
    totalActualSavings: number;
    breakdown: {
        needs: number;
        wants: number;
        savings: number;
        excess: number;
    };
    percentages: {
        needs: number;
        wants: number;
        savings: number;
        excess: number;
    };
    ideal: BudgetRatios & { income: number };
    deviations: BudgetRatios;
    efficiencyScore: number;
    savingsRate: number;
}

export function calculateBudget(data: BudgetData, filterMonth?: number, filterYear?: number): CalculationResult {
    const { income: globalIncome, monthlyIncomes = {}, expenses = [], mode } = data;
    const ratios = MODES[mode];

    let effectiveIncome = globalIncome;

    if (filterMonth !== undefined && filterYear !== undefined) {
        const key = `${filterYear}-${String(filterMonth + 1).padStart(2, '0')}`;
        effectiveIncome = monthlyIncomes[key] ?? globalIncome;
    } else {
        const activeMonths = new Set(expenses.map(e => {
            const d = new Date(e.date);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        }));

        let totalIncome = 0;
        if (activeMonths.size > 0) {
            activeMonths.forEach(m => {
                totalIncome += monthlyIncomes[m] ?? globalIncome;
            });
            effectiveIncome = totalIncome;
        } else {
            effectiveIncome = globalIncome;
        }
    }

    const filteredExpenses = expenses.filter(exp => {
        if (filterMonth === undefined || filterYear === undefined) return true;
        const d = new Date(exp.date);
        return d.getMonth() === filterMonth && d.getFullYear() === filterYear;
    });

    const breakdown = filteredExpenses.reduce((acc, expense) => {
        const cat = expense.category;
        const amt = Number(expense.amount) || 0;
        if (cat === 'Need') acc.needs += amt;
        else if (cat === 'Want') acc.wants += amt;
        else if (cat === 'Saving/Invested') acc.savings += amt;
        else if (cat === 'Excess') acc.excess += amt;
        return acc;
    }, { needs: 0, wants: 0, savings: 0, excess: 0 });

    const expensesTotal = breakdown.needs + breakdown.wants + breakdown.excess;
    // User: "why does savings count as money ouflow and also in spent"
    // So Total Spent should ONLY be expenses (money gone).
    const totalSpent = expensesTotal;

    // Total Allocated includes savings for remaining calculation
    const totalAllocated = expensesTotal + breakdown.savings;
    const remaining = effectiveIncome - totalAllocated;

    // User: "if the month ends and some money is still left ... thats also savings"
    const totalActualSavings = breakdown.savings + (remaining > 0 ? remaining : 0);

    const ideal = {
        income: effectiveIncome,
        needs: effectiveIncome * ratios.needs,
        wants: effectiveIncome * ratios.wants,
        savings: effectiveIncome * ratios.savings,
    };

    const percentages = {
        needs: effectiveIncome > 0 ? (breakdown.needs / effectiveIncome) * 100 : 0,
        wants: effectiveIncome > 0 ? (breakdown.wants / effectiveIncome) * 100 : 0,
        savings: effectiveIncome > 0 ? (totalActualSavings / effectiveIncome) * 100 : 0, // Use totalActualSavings for percentage
        excess: effectiveIncome > 0 ? (breakdown.excess / effectiveIncome) * 100 : 0,
    };

    const deviations = {
        needs: breakdown.needs - ideal.needs,
        wants: (breakdown.wants + breakdown.excess) - ideal.wants,
        savings: breakdown.savings - ideal.savings, // Use explicit savings for Goal Tracking variance
    };

    const savingsRate = effectiveIncome > 0 ? (totalActualSavings / effectiveIncome) * 100 : 0;

    let score = 100;
    if (effectiveIncome > 0) {
        if (remaining < 0) score -= Math.min(30, (Math.abs(remaining) / effectiveIncome) * 100);
        if (breakdown.excess > 0) score -= Math.min(20, (breakdown.excess / effectiveIncome) * 50);
        const totalDeviationPenalty = (
            Math.max(0, deviations.needs / effectiveIncome) * 40 +
            Math.max(0, -deviations.savings / effectiveIncome) * 60
        );
        score -= totalDeviationPenalty;
    } else {
        score = 0;
    }

    return {
        totalSpent,
        remaining,
        income: effectiveIncome,
        expensesTotal,
        totalActualSavings,
        breakdown,
        percentages,
        ideal,
        deviations,
        efficiencyScore: Math.max(0, Math.min(100, Math.round(score))),
        savingsRate
    };
}

export function groupExpensesByMonth(expenses: Expense[]) {
    const groups: Record<string, { total: number, needs: number, wants: number, savings: number, excess: number }> = {};

    expenses.forEach(exp => {
        const date = new Date(exp.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!groups[key]) {
            groups[key] = { total: 0, needs: 0, wants: 0, savings: 0, excess: 0 };
        }
        const amt = Number(exp.amount) || 0;
        groups[key].total += amt;
        if (exp.category === 'Need') groups[key].needs += amt;
        else if (exp.category === 'Want') groups[key].wants += amt;
        else if (exp.category === 'Saving/Invested') groups[key].savings += amt;
        else if (exp.category === 'Excess') groups[key].excess += amt;
    });

    return Object.entries(groups)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, data]) => ({ month, ...data }));
}

export function groupExpensesByDay(expenses: Expense[], lastDays = 30) {
    const groups: Record<string, number> = {};
    const now = new Date();

    for (let i = 0; i < lastDays; i++) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        groups[d.toISOString().split('T')[0]] = 0;
    }

    expenses.forEach(exp => {
        const day = exp.date.split('T')[0];
        if (groups[day] !== undefined) {
            groups[day] += Number(exp.amount) || 0;
        }
    });

    return Object.entries(groups)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, total]) => ({ date, total }));
}
