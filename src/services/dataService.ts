import { Account, Category, Transaction, Budget, Bet, UserSettings, DashboardStats } from '../types'

// Mock data for development
const mockAccounts: Account[] = [
  {
    id: 'acc_1',
    userId: 'user_1',
    name: 'Compte Principal',
    type: 'bank',
    balance: 59.02,
    initialBalance: 59.02,
    currency: 'EUR',
    lastFour: '4920',
    institution: 'BoursoBank',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'acc_2',
    userId: 'user_1',
    name: 'Compte Commun',
    type: 'bank',
    balance: 183.81,
    initialBalance: 183.81,
    currency: 'EUR',
    lastFour: '5431',
    institution: 'BoursoBank',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'acc_3',
    userId: 'user_1',
    name: 'Épargne',
    type: 'bank',
    balance: 3501.79,
    initialBalance: 3501.79,
    currency: 'EUR',
    institution: 'Revolut',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'acc_4',
    userId: 'user_1',
    name: 'Carte Déjeuner',
    type: 'wallet',
    balance: 189.04,
    initialBalance: 189.04,
    currency: 'EUR',
    institution: 'Edenred',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'acc_5',
    userId: 'user_1',
    name: 'Livret A',
    type: 'bank',
    balance: 176.67,
    initialBalance: 176.67,
    currency: 'EUR',
    institution: 'Épargne réglementée',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const mockExpenseCategories: Category[] = [
  { id: 'cat_exp_1', userId: 'user_1', name: 'Loyer', type: 'expense', color: '#ef4444', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_exp_2', userId: 'user_1', name: 'Électricité / Gaz', type: 'expense', color: '#f97316', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_exp_3', userId: 'user_1', name: 'Internet', type: 'expense', color: '#eab308', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_exp_4', userId: 'user_1', name: 'Téléphone', type: 'expense', color: '#22c55e', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_exp_5', userId: 'user_1', name: 'Abonnements', type: 'expense', color: '#3b82f6', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_exp_6', userId: 'user_1', name: 'Transport', type: 'expense', color: '#8b5cf6', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_exp_7', userId: 'user_1', name: 'Courses', type: 'expense', color: '#ec4899', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_exp_8', userId: 'user_1', name: 'Restaurants', type: 'expense', color: '#f59e0b', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_exp_9', userId: 'user_1', name: 'Loisirs', type: 'expense', color: '#10b981', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_exp_10', userId: 'user_1', name: 'Santé', type: 'expense', color: '#06b6d4', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_exp_11', userId: 'user_1', name: 'Habillement', type: 'expense', color: '#8b5cf6', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_exp_12', userId: 'user_1', name: 'Vacances', type: 'expense', color: '#f43f5e', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_exp_13', userId: 'user_1', name: 'Cadeaux', type: 'expense', color: '#a855f7', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_exp_14', userId: 'user_1', name: 'Divers', type: 'expense', color: '#6b7280', isDefault: true, createdAt: new Date().toISOString() }
]

const mockIncomeCategories: Category[] = [
  { id: 'cat_inc_1', userId: 'user_1', name: 'Salaire', type: 'income', color: '#22c55e', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_inc_2', userId: 'user_1', name: 'Aides / Allocations', type: 'income', color: '#3b82f6', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_inc_3', userId: 'user_1', name: 'Remboursements', type: 'income', color: '#8b5cf6', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_inc_4', userId: 'user_1', name: 'Revenus secondaires', type: 'income', color: '#f59e0b', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat_inc_5', userId: 'user_1', name: 'Autres revenus', type: 'income', color: '#06b6d4', isDefault: true, createdAt: new Date().toISOString() }
]

const mockCategories = [...mockExpenseCategories, ...mockIncomeCategories]
const mockTransactions: Transaction[] = []

// Data service functions
export const dataService = {
  // Accounts
  async getAccounts(): Promise<Account[]> {
    return mockAccounts
  },

  async createAccount(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const newAccount: Account = {
      ...account,
      id: `acc_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockAccounts.push(newAccount)
    return newAccount
  },

  async updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
    const index = mockAccounts.findIndex(acc => acc.id === id)
    if (index === -1) throw new Error('Account not found')
    
    mockAccounts[index] = {
      ...mockAccounts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return mockAccounts[index]
  },

  async deleteAccount(id: string): Promise<void> {
    const index = mockAccounts.findIndex(acc => acc.id === id)
    if (index === -1) throw new Error('Account not found')
    mockAccounts.splice(index, 1)
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    return mockCategories
  },

  async createCategory(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: `cat_${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    mockCategories.push(newCategory)
    return newCategory
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const index = mockCategories.findIndex(cat => cat.id === id)
    if (index === -1) throw new Error('Category not found')
    
    mockCategories[index] = { ...mockCategories[index], ...updates }
    return mockCategories[index]
  },

  async deleteCategory(id: string): Promise<void> {
    const index = mockCategories.findIndex(cat => cat.id === id)
    if (index === -1) throw new Error('Category not found')
    mockCategories.splice(index, 1)
  },

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    return mockTransactions.map(txn => ({
      ...txn,
      account: mockAccounts.find(acc => acc.id === txn.accountId),
      category: mockCategories.find(cat => cat.id === txn.categoryId),
      transferToAccount: txn.transferToAccountId ? mockAccounts.find(acc => acc.id === txn.transferToAccountId) : undefined
    }))
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Update account balance
    const account = mockAccounts.find(acc => acc.id === transaction.accountId)
    if (account) {
      if (transaction.type === 'income') {
        account.balance += transaction.amount
      } else if (transaction.type === 'expense') {
        account.balance -= transaction.amount
      } else if (transaction.type === 'transfer' && transaction.transferToAccountId) {
        account.balance -= transaction.amount
        const toAccount = mockAccounts.find(acc => acc.id === transaction.transferToAccountId)
        if (toAccount) {
          toAccount.balance += transaction.amount
        }
      }
      account.updatedAt = new Date().toISOString()
    }
    
    mockTransactions.push(newTransaction)
    return newTransaction
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const index = mockTransactions.findIndex(txn => txn.id === id)
    if (index === -1) throw new Error('Transaction not found')
    
    const oldTransaction = mockTransactions[index]
    
    // Revert old transaction effects on account balance
    const account = mockAccounts.find(acc => acc.id === oldTransaction.accountId)
    if (account) {
      if (oldTransaction.type === 'income') {
        account.balance -= oldTransaction.amount
      } else if (oldTransaction.type === 'expense') {
        account.balance += oldTransaction.amount
      } else if (oldTransaction.type === 'transfer' && oldTransaction.transferToAccountId) {
        account.balance += oldTransaction.amount
        const toAccount = mockAccounts.find(acc => acc.id === oldTransaction.transferToAccountId)
        if (toAccount) {
          toAccount.balance -= oldTransaction.amount
        }
      }
    }
    
    // Update transaction
    mockTransactions[index] = {
      ...oldTransaction,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    const updatedTransaction = mockTransactions[index]
    
    // Apply new transaction effects on account balance
    const newAccount = mockAccounts.find(acc => acc.id === updatedTransaction.accountId)
    if (newAccount) {
      if (updatedTransaction.type === 'income') {
        newAccount.balance += updatedTransaction.amount
      } else if (updatedTransaction.type === 'expense') {
        newAccount.balance -= updatedTransaction.amount
      } else if (updatedTransaction.type === 'transfer' && updatedTransaction.transferToAccountId) {
        newAccount.balance -= updatedTransaction.amount
        const toAccount = mockAccounts.find(acc => acc.id === updatedTransaction.transferToAccountId)
        if (toAccount) {
          toAccount.balance += updatedTransaction.amount
        }
      }
      newAccount.updatedAt = new Date().toISOString()
    }
    
    return updatedTransaction
  },

  async deleteTransaction(id: string): Promise<void> {
    const index = mockTransactions.findIndex(txn => txn.id === id)
    if (index === -1) throw new Error('Transaction not found')
    
    const transaction = mockTransactions[index]
    
    // Revert transaction effects on account balance
    const account = mockAccounts.find(acc => acc.id === transaction.accountId)
    if (account) {
      if (transaction.type === 'income') {
        account.balance -= transaction.amount
      } else if (transaction.type === 'expense') {
        account.balance += transaction.amount
      } else if (transaction.type === 'transfer' && transaction.transferToAccountId) {
        account.balance += transaction.amount
        const toAccount = mockAccounts.find(acc => acc.id === transaction.transferToAccountId)
        if (toAccount) {
          toAccount.balance -= transaction.amount
        }
      }
      account.updatedAt = new Date().toISOString()
    }
    
    mockTransactions.splice(index, 1)
  },

  // Dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    const totalBalance = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0)
    
    // Calculate monthly income and expenses
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    
    const monthlyTransactions = mockTransactions.filter(txn => {
      const txnDate = new Date(txn.date)
      return txnDate.getMonth() + 1 === currentMonth && txnDate.getFullYear() === currentYear
    })
    
    const monthlyIncome = monthlyTransactions
      .filter(txn => txn.type === 'income')
      .reduce((sum, txn) => sum + txn.amount, 0)
    
    const monthlyExpenses = monthlyTransactions
      .filter(txn => txn.type === 'expense')
      .reduce((sum, txn) => sum + txn.amount, 0)
    
    const netCashFlow = monthlyIncome - monthlyExpenses
    
    // Get recent transactions (last 10)
    const recentTransactions = mockTransactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(txn => ({
        ...txn,
        account: mockAccounts.find(acc => acc.id === txn.accountId),
        category: mockCategories.find(cat => cat.id === txn.categoryId),
        transferToAccount: txn.transferToAccountId ? mockAccounts.find(acc => acc.id === txn.transferToAccountId) : undefined
      }))
    
    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      netCashFlow,
      accountBalances: mockAccounts.map(acc => ({ accountId: acc.id, balance: acc.balance })),
      topCategories: [],
      recentTransactions
    }
  },

  // User settings
  async getUserSettings(): Promise<UserSettings> {
    return {
      id: 'settings_1',
      userId: 'user_1',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
      fiscalStartMonth: 1,
      fiscalStartYear: 2024,
      theme: 'light',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },

  async updateUserSettings(updates: Partial<UserSettings>): Promise<UserSettings> {
    // Mock implementation
    return {
      id: 'settings_1',
      userId: 'user_1',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
      fiscalStartMonth: 1,
      fiscalStartYear: 2024,
      theme: 'light',
      ...updates,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
}