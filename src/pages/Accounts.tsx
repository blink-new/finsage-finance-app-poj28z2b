import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  CreditCard,
  Building,
  TrendingUp,
  Wallet,
  Bitcoin
} from 'lucide-react'
import { dataService } from '../services/dataService'
import { Account } from '../types'
import { cn } from '../lib/utils'
import { toast } from 'sonner'

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank' as Account['type'],
    balance: '',
    institution: '',
    lastFour: ''
  })

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      const data = await dataService.getAccounts()
      setAccounts(data)
    } catch (error) {
      console.error('Failed to load accounts:', error)
      toast.error('Failed to load accounts')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingAccount) {
        const updated = await dataService.updateAccount(editingAccount.id, {
          name: formData.name,
          type: formData.type,
          balance: parseFloat(formData.balance) || 0,
          institution: formData.institution,
          lastFour: formData.lastFour
        })
        setAccounts(accounts.map(acc => acc.id === updated.id ? updated : acc))
        toast.success('Account updated successfully')
      } else {
        const newAccount = await dataService.createAccount({
          userId: 'user_1', // This would come from auth
          name: formData.name,
          type: formData.type,
          balance: parseFloat(formData.balance) || 0,
          initialBalance: parseFloat(formData.balance) || 0,
          currency: 'EUR',
          institution: formData.institution,
          lastFour: formData.lastFour,
          isActive: true
        })
        setAccounts([...accounts, newAccount])
        toast.success('Account created successfully')
      }
      
      resetForm()
    } catch (error) {
      console.error('Failed to save account:', error)
      toast.error('Failed to save account')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return
    
    try {
      await dataService.deleteAccount(id)
      setAccounts(accounts.filter(acc => acc.id !== id))
      toast.success('Account deleted successfully')
    } catch (error) {
      console.error('Failed to delete account:', error)
      toast.error('Failed to delete account')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'bank',
      balance: '',
      institution: '',
      lastFour: ''
    })
    setEditingAccount(null)
    setIsAddDialogOpen(false)
  }

  const startEdit = (account: Account) => {
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      institution: account.institution || '',
      lastFour: account.lastFour || ''
    })
    setEditingAccount(account)
    setIsAddDialogOpen(true)
  }

  const formatCurrency = (amount: number) => {
    if (!balanceVisible) return '••••'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'bank':
        return <Building className="h-5 w-5" />
      case 'credit':
        return <CreditCard className="h-5 w-5" />
      case 'investment':
        return <TrendingUp className="h-5 w-5" />
      case 'crypto':
        return <Bitcoin className="h-5 w-5" />
      case 'wallet':
        return <Wallet className="h-5 w-5" />
      default:
        return <Building className="h-5 w-5" />
    }
  }

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'balance-positive'
    if (balance < 0) return 'balance-negative'
    return 'balance-neutral'
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-foreground">Accounts</h1>
          <p className="text-muted-foreground">Manage your financial accounts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBalanceVisible(!balanceVisible)}
          >
            {balanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAccount ? 'Edit Account' : 'Add New Account'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Account Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Compte Principal"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Account Type</Label>
                  <Select value={formData.type} onValueChange={(value: Account['type']) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Account</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="wallet">Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="balance">Current Balance (€)</Label>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="e.g., BoursoBank"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastFour">Last 4 Digits (Optional)</Label>
                  <Input
                    id="lastFour"
                    value={formData.lastFour}
                    onChange={(e) => setFormData({ ...formData, lastFour: e.target.value })}
                    placeholder="1234"
                    maxLength={4}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAccount ? 'Update' : 'Create'} Account
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Total Balance Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Total Balance</span>
            <Badge variant="secondary">{accounts.length} accounts</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn("text-4xl font-bold", getBalanceColor(totalBalance))}>
            {formatCurrency(totalBalance)}
          </div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getAccountIcon(account.type)}
                  <CardTitle className="text-lg">{account.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(account)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(account.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className={cn("text-2xl font-bold", getBalanceColor(account.balance))}>
                  {formatCurrency(account.balance)}
                </p>
                <p className="text-sm text-muted-foreground">Current Balance</p>
              </div>
              
              <div className="space-y-1">
                {account.institution && (
                  <p className="text-sm text-muted-foreground">
                    {account.institution}
                  </p>
                )}
                {account.lastFour && (
                  <p className="text-sm text-muted-foreground">
                    ****{account.lastFour}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={account.isActive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {account.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {account.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {accounts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No accounts yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first financial account
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Account
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}