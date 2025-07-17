import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Dice6, Plus } from 'lucide-react'

export default function Betting() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Betting Tracker</h1>
          <p className="text-muted-foreground">Track your betting activities and performance</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Bet
        </Button>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="text-center py-16">
          <Dice6 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Betting Tracker Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Track your bets, analyze performance by platform and game type, monitor ROI, and manage your betting budget responsibly.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}