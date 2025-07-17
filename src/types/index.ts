export interface User {
  id: string
  email: string
  displayName?: string
  createdAt: string
}

export interface Account {
  id: string
  userId: string
  name: string
  type: 'bank' | 'credit' | 'investment' | 'crypto' | 'wallet'
  balance: number
  initialBalance: number
  currency: string
  lastFour?: string
  institution?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  userId: string
  name: string
  type: 'income' | 'expense'
  color: string
  isDefault: boolean
  createdAt: string
}

export interface Transaction {
  id: string
  userId: string
  accountId: string
  categoryId?: string
  type: 'income' | 'expense' | 'transfer'
  amount: number
  description?: string
  notes?: string
  date: string
  transferToAccountId?: string
  isRecurring: boolean
  createdAt: string
  updatedAt: string
  // Populated fields
  account?: Account
  category?: Category
  transferToAccount?: Account
}

export interface Budget {
  id: string
  userId: string
  categoryId: string
  month: number
  year: number
  estimatedAmount: number
  plannedAmount: number
  actualAmount: number
  createdAt: string
  updatedAt: string
  // Populated fields
  category?: Category
}

export interface Bet {
  id: string
  userId: string
  accountId: string
  platform: string
  gameType: string
  amountWagered: number
  amountWon: number
  netResult: number
  date: string
  notes?: string
  createdAt: string
  // Populated fields
  account?: Account
}

export interface UserSettings {
  id: string
  userId: string
  currency: string
  dateFormat: string
  fiscalStartMonth: number
  fiscalStartYear: number
  defaultAccountId?: string
  theme: 'light' | 'dark'
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  netCashFlow: number
  accountBalances: { accountId: string; balance: number }[]
  topCategories: { categoryId: string; amount: number; percentage: number }[]
  recentTransactions: Transaction[]
}

export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface CashFlowData {
  date: string
  income: number
  expenses: number
  balance: number
}

export interface BudgetComparison {
  categoryId: string
  categoryName: string
  budgeted: number
  actual: number
  difference: number
  percentage: number
  status: 'under' | 'over' | 'on-track'
}