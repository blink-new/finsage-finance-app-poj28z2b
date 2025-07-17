import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  ArrowLeftRight,
  Plus,
  Eye,
  EyeOff,
  PiggyBank
} from 'lucide-react'
import { dataService } from '../services/dataService'
import { Account, DashboardStats } from '../types'
import { cn } from '../lib/utils'

export default function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [accountsData, statsData] = await Promise.all([
        dataService.getAccounts(),
        dataService.getDashboardStats()
      ])
      setAccounts(accountsData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    if (!balanceVisible) return '••••'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return '🏦'
      case 'credit':
        return '💳'
      case 'investment':
        return '📈'
      case 'crypto':
        return '₿'
      case 'wallet':
        return '👛'
      default:
        return '💰'
    }
  }

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'balance-positive'
    if (balance < 0) return 'balance-negative'
    return 'balance-neutral'
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBalanceVisible(!balanceVisible)}
          >
            {balanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button asChild>
            <Link to="/transactions">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", getBalanceColor(stats?.totalBalance || 0))}>
              {formatCurrency(stats?.totalBalance || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {accounts.length} accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(stats?.monthlyIncome || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats?.monthlyExpenses || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
            <div className={cn(
              "h-4 w-4",
              (stats?.netCashFlow || 0) >= 0 ? "text-emerald-600" : "text-red-600"
            )}>
              {(stats?.netCashFlow || 0) >= 0 ? <ArrowUpRight /> : <ArrowDownRight />}
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              getBalanceColor(stats?.netCashFlow || 0)
            )}>
              {formatCurrency(stats?.netCashFlow || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Balances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getAccountTypeIcon(account.type)}</div>
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {account.institution}
                      {account.lastFour && ` • ****${account.lastFour}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("font-semibold", getBalanceColor(account.balance))}>
                    {formatCurrency(account.balance)}
                  </p>
                  <Badge variant={account.isActive ? "default" : "secondary"} className="text-xs">
                    {account.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {stats.recentTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        transaction.type === 'income' ? "bg-emerald-500" : 
                        transaction.type === 'expense' ? "bg-red-500" : "bg-blue-500"
                      )} />
                      <div>
                        <p className="font-medium text-sm">{transaction.description || 'Transaction'}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.account?.name} • {new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className={cn(
                      "font-semibold text-sm",
                      transaction.type === 'income' ? "text-emerald-600" : "text-red-600"
                    )}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ArrowLeftRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent transactions</p>
                <p className="text-sm">Start by adding your first transaction</p>
                <Button className="mt-4" size="sm" asChild>
                  <Link to="/transactions">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link to="/transactions">
                <Plus className="h-6 w-6" />
                <span className="text-sm">Add Income</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link to="/transactions">
                <TrendingDown className="h-6 w-6" />
                <span className="text-sm">Add Expense</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link to="/transactions">
                <ArrowLeftRight className="h-6 w-6" />
                <span className="text-sm">Transfer</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link to="/budget">
                <PiggyBank className="h-6 w-6" />
                <span className="text-sm">Set Budget</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}