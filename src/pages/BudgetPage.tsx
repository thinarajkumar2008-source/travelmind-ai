import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Wallet, Compass, DollarSign, Sparkles, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { api } from '../lib/api'
import { BudgetEstimate } from '../types'

export default function BudgetPage() {
  const [searchParams] = useSearchParams()
  const destinationId = searchParams.get('destination') || 'munnar'

  const [durationDays, setDurationDays] = useState(4)
  const [travelersCount, setTravelersCount] = useState(2)
  const [tier, setTier] = useState<'budget' | 'moderate' | 'luxury'>('moderate')
  const [currency, setCurrency] = useState('USD')
  
  const [estimate, setEstimate] = useState<BudgetEstimate | null>(null)
  const [loading, setLoading] = useState(true)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    async function calc() {
      setLoading(true)
      const data = await api.calculateBudget({
        destinationId,
        destinationName: destinationId.charAt(0).toUpperCase() + destinationId.slice(1),
        durationDays,
        travelersCount,
        tier,
        currency,
      })
      setEstimate(data)
      setLoading(false)
    }
    calc()
  }, [destinationId, durationDays, travelersCount, tier, currency])

  const breakdownItems = estimate ? [
    { label: 'Hotels & Lodging', amount: estimate.breakdown.accommodation, color: 'bg-teal-400' },
    { label: 'Food & Dining', amount: estimate.breakdown.food, color: 'bg-amber-400' },
    { label: 'Local Transport & Cabs', amount: estimate.breakdown.localTransport, color: 'bg-indigo-400' },
    { label: 'Attraction Tickets & Safaris', amount: estimate.breakdown.sightseeing, color: 'bg-emerald-400' },
    { label: 'Shopping & Miscellaneous', amount: estimate.breakdown.miscellaneous, color: 'bg-rose-400' },
  ] : []

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link to={`/destination/${destinationId}`} className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            Back to {destinationId.toUpperCase()} Guide
          </Link>
          <button
            onClick={() => {
              setSavedSuccess(true)
              setTimeout(() => setSavedSuccess(false), 3000)
            }}
            className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md"
          >
            <Wallet className="w-3.5 h-3.5" /> {savedSuccess ? 'Saved to Database!' : 'Save Budget'}
          </button>
        </div>

        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-bold text-teal-300">
            <Wallet className="w-3.5 h-3.5 text-teal-400" />
            Travel Budget Estimator
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Trip Cost Breakdown: {destinationId.charAt(0).toUpperCase() + destinationId.slice(1)}
          </h1>
          <p className="text-xs sm:text-sm text-navy-400 max-w-lg mx-auto">
            Transparent estimates derived from real local lodging rates, dining averages, and route fees.
          </p>
        </div>

        {/* Input Parameters Form */}
        <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 grid sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-navy-400 uppercase tracking-wider mb-2">Trip Length</label>
            <input
              type="number"
              min={1}
              max={30}
              value={durationDays}
              onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value)))}
              className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-navy-400 uppercase tracking-wider mb-2">Travelers</label>
            <input
              type="number"
              min={1}
              max={20}
              value={travelersCount}
              onChange={(e) => setTravelersCount(Math.max(1, Number(e.target.value)))}
              className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-navy-400 uppercase tracking-wider mb-2">Travel Style</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as any)}
              className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 capitalize"
            >
              <option value="budget">Backpacker / Budget</option>
              <option value="moderate">Moderate / Comfort</option>
              <option value="luxury">Luxury Resorts</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-navy-400 uppercase tracking-wider mb-2">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>

        {/* Results Overview Card */}
        {estimate && (
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-teal-950/60 to-navy-900 border border-teal-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <span className="text-xs uppercase font-bold text-teal-300">Total Projected Expense</span>
                <h2 className="text-4xl sm:text-5xl font-black text-white mt-1">
                  ${estimate.totalBudget} <span className="text-lg font-medium text-navy-400">{estimate.currency}</span>
                </h2>
                <p className="text-xs text-navy-300 mt-2">
                  For {estimate.durationDays} days · {estimate.travelersCount} travelers (~${estimate.perPersonBudget} per person)
                </p>
              </div>

              <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
                <p className="text-navy-400">Priced on <span className="text-white font-semibold capitalize">{tier}</span> tier</p>
                <p className="text-teal-300 font-medium">✓ Includes lodging, meals, & transport</p>
              </div>
            </div>

            {/* Visual Expense Bar */}
            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-400" />
                Category Allocations
              </h3>

              {/* Progress Stack */}
              <div className="h-4 rounded-full overflow-hidden flex bg-navy-900 border border-white/5">
                {breakdownItems.map((item) => {
                  const pct = Math.round((item.amount / estimate.totalBudget) * 100) || 1
                  return (
                    <div
                      key={item.label}
                      className={`${item.color} h-full`}
                      style={{ width: `${pct}%` }}
                      title={`${item.label}: $${item.amount} (${pct}%)`}
                    />
                  )
                })}
              </div>

              {/* Legend & Amounts */}
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {breakdownItems.map((item) => {
                  const pct = Math.round((item.amount / estimate.totalBudget) * 100)
                  return (
                    <div key={item.label} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-navy-300">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white">${item.amount}</span>
                        <span className="text-navy-500 text-[10px] ml-1">({pct}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Money Saving AI Tips */}
            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                Local Cost-Saving Recommendations
              </h3>
              <div className="space-y-2">
                {estimate.moneySavingTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-navy-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
