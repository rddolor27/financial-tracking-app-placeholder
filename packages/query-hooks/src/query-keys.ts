export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  accounts: {
    all: ['accounts'] as const,
    list: (filters?: Record<string, unknown>) => ['accounts', 'list', filters] as const,
    detail: (id: string) => ['accounts', 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: (filters?: Record<string, unknown>) => ['categories', 'list', filters] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    list: (filters?: Record<string, unknown>) => ['transactions', 'list', filters] as const,
    detail: (id: string) => ['transactions', 'detail', id] as const,
    search: (query: string) => ['transactions', 'search', query] as const,
  },
  budgets: {
    all: ['budgets'] as const,
    list: (filters?: Record<string, unknown>) => ['budgets', 'list', filters] as const,
    detail: (id: string) => ['budgets', 'detail', id] as const,
  },
  investments: {
    all: ['investments'] as const,
    list: (filters?: Record<string, unknown>) => ['investments', 'list', filters] as const,
    detail: (id: string) => ['investments', 'detail', id] as const,
    prices: ['investments', 'prices'] as const,
  },
  goals: {
    all: ['goals'] as const,
    list: (filters?: Record<string, unknown>) => ['goals', 'list', filters] as const,
    detail: (id: string) => ['goals', 'detail', id] as const,
    summary: ['goals', 'summary'] as const,
  },
  billReminders: {
    all: ['billReminders'] as const,
    list: (filters?: Record<string, unknown>) => ['billReminders', 'list', filters] as const,
    detail: (id: string) => ['billReminders', 'detail', id] as const,
    upcoming: ['billReminders', 'upcoming'] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: (filters?: Record<string, unknown>) => ['notifications', 'list', filters] as const,
    unreadCount: ['notifications', 'unreadCount'] as const,
  },
  insights: {
    spendingByCategory: (params?: Record<string, unknown>) => ['insights', 'spendingByCategory', params] as const,
    trends: (params?: Record<string, unknown>) => ['insights', 'trends', params] as const,
    incomeVsExpense: (params?: Record<string, unknown>) => ['insights', 'incomeVsExpense', params] as const,
    savingsRate: (params?: Record<string, unknown>) => ['insights', 'savingsRate', params] as const,
  },
  subscription: {
    plans: ['subscription', 'plans'] as const,
    me: ['subscription', 'me'] as const,
  },
  exchangeRates: {
    all: ['exchangeRates'] as const,
  },
};
