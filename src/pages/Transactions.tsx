import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { 
  Plus, 
  ArrowLeftRight, 
  TrendingUp, 
  TrendingDown,
  Edit,
  Trash2,
  Filter
} from 'lucide-react'
import { dataService } from '../services/dataService'
import { Transaction, Account, Category } from '../types'
import { cn } from '../lib/utils'
import { toast } from 'sonner'

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    type: 'expense' as Transaction['type'],
    amount: '',
    description: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    accountId: '',
    categoryId: '',
    transferToAccountId: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [transactionsData, accountsData, categoriesData] = await Promise.all([
        dataService.getTransactions(),
        dataService.getAccounts(),
        dataService.getCategories()
      ])
      setTransactions(transactionsData)
      setAccounts(accountsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const transactionData = {
        userId: 'user_1',
        type: formData.type,
        amount: parseFloat(formData.amount) || 0,
        description: formData.description,
        notes: formData.notes,
        date: formData.date,
        accountId: formData.accountId,
        categoryId: formData.categoryId || undefined,
        transferToAccountId: formData.type === 'transfer' ? formData.transferToAccountId : undefined,
        isRecurring: false
      }

      if (editingTransaction) {
        const updated = await dataService.updateTransaction(editingTransaction.id, transactionData)
        setTransactions(transactions.map(txn => txn.id === updated.id ? updated : txn))
        toast.success('Transaction updated successfully')
      } else {
        const newTransaction = await dataService.createTransaction(transactionData)
        setTransactions([newTransaction, ...transactions])
        toast.success('Transaction created successfully')
      }
      
      resetForm()
      // Reload accounts to get updated balances
      const updatedAccounts = await dataService.getAccounts()
      setAccounts(updatedAccounts)
    } catch (error) {
      console.error('Failed to save transaction:', error)
      toast.error('Failed to save transaction')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return
    
    try {
      await dataService.deleteTransaction(id)
      setTransactions(transactions.filter(txn => txn.id !== id))
      toast.success('Transaction deleted successfully')
      // Reload accounts to get updated balances
      const updatedAccounts = await dataService.getAccounts()
      setAccounts(updatedAccounts)
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      toast.error('Failed to delete transaction')
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'expense',
      amount: '',
      description: '',
      notes: '',
      date: new Date().toISOString().split('T')[0],
      accountId: '',
      categoryId: '',
      transferToAccountId: ''
    })
    setEditingTransaction(null)
    setIsAddDialogOpen(false)
  }

  const startEdit = (transaction: Transaction) => {
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      description: transaction.description || '',
      notes: transaction.notes || '',
      date: transaction.date,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId || '',
      transferToAccountId: transaction.transferToAccountId || ''
    })
    setEditingTransaction(transaction)
    setIsAddDialogOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />
      case 'expense':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'transfer':
        return <ArrowLeftRight className="h-4 w-4 text-blue-600" />
      default:
        return <ArrowLeftRight className="h-4 w-4" />
    }
  }

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'text-emerald-600'
      case 'expense':
        return 'text-red-600'
      case 'transfer':
        return 'text-blue-600'
      default:
        return 'text-foreground'
    }
  }

  const filteredCategories = categories.filter(cat => 
    formData.type === 'transfer' ? false : cat.type === formData.type
  )

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">Track your income, expenses, and transfers</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Transaction Type</Label>
                  <Select value={formData.type} onValueChange={(value: Transaction['type']) => setFormData({ ...formData, type: value, categoryId: '' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Amount (€)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="accountId">From Account</Label>
                  <Select value={formData.accountId} onValueChange={(value) => setFormData({ ...formData, accountId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ({formatCurrency(account.balance)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === 'transfer' && (
                  <div>
                    <Label htmlFor="transferToAccountId">To Account</Label>
                    <Select value={formData.transferToAccountId} onValueChange={(value) => setFormData({ ...formData, transferToAccountId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.filter(acc => acc.id !== formData.accountId).map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} ({formatCurrency(account.balance)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.type !== 'transfer' && (
                  <div>
                    <Label htmlFor="categoryId">Category</Label>
                    <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Transaction description"
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTransaction ? 'Update' : 'Create'} Transaction
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50">
                  <div className="flex items-center space-x-4">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium">
                        {transaction.description || `${transaction.type} transaction`}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{transaction.account?.name}</span>
                        {transaction.type === 'transfer' && transaction.transferToAccount && (
                          <>
                            <span>→</span>
                            <span>{transaction.transferToAccount.name}</span>
                          </>
                        )}
                        {transaction.category && (
                          <>
                            <span>•</span>
                            <span>{transaction.category.name}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={cn("font-semibold", getTransactionColor(transaction.type))}>
                        {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <Badge variant="outline" className="text-xs capitalize">
                        {transaction.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(transaction)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ArrowLeftRight className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your finances by adding your first transaction
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Transaction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}