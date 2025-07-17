import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { BarChart3, TrendingUp } from 'lucide-react'

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Visualize your financial data and trends</p>
        </div>
        <Button variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="text-center py-16">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Advanced Analytics Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Interactive charts, spending patterns, cash flow analysis, and detailed financial insights to help you make better decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}