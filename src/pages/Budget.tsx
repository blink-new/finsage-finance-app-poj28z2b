import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { PiggyBank, Plus } from 'lucide-react'

export default function Budget() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Budget</h1>
          <p className="text-muted-foreground">Plan and track your monthly budgets</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="text-center py-16">
          <PiggyBank className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Budget Planning Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Create monthly budgets, track spending against your plans, and get insights into your financial habits.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}