import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import blink from './blink/client'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import Analytics from './pages/Analytics'
import Betting from './pages/Betting'
import Settings from './pages/Settings'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-lg finance-gradient flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-lg">FS</span>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
          <p className="text-muted-foreground">Loading FinSage...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="h-16 w-16 rounded-lg finance-gradient flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">FS</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to FinSage</h1>
            <p className="text-muted-foreground">
              Your comprehensive personal finance management platform
            </p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                <span>Multi-Account Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span>Budget Planning</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                <span>Analytics & Insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                <span>Betting Tracker</span>
              </div>
            </div>
            <button
              onClick={() => blink.auth.login()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="budget" element={<Budget />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="betting" element={<Betting />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App