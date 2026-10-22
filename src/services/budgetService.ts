import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { BudgetEstimate } from '../types'

export const budgetService = {
  async getUserBudget(userId: string, destinationId: string): Promise<BudgetEstimate | null> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(`travelmind_budget_${userId}_${destinationId}`)
      return stored ? JSON.parse(stored) : null
    }

    const { data, error } = await supabase
      .from('travel_budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('destination_id', destinationId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) return null

    return {
      destinationId: data.destination_id,
      destinationName: data.destination_name,
      durationDays: data.number_of_days,
      travelersCount: data.number_of_travelers,
      currency: data.currency,
      tier: data.tier,
      breakdown: {
        accommodation: Number(data.accommodation_cost),
        food: Number(data.food_cost),
        localTransport: Number(data.transport_cost),
        sightseeing: Number(data.activities_cost),
        miscellaneous: Number(data.miscellaneous_cost),
      },
      totalBudget: Number(data.estimated_total),
      perPersonBudget: Number(data.per_person_budget),
      moneySavingTips: data.budget_details?.tips || [],
    }
  },

  async saveBudget(userId: string, budget: BudgetEstimate): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) {
      localStorage.setItem(
        `travelmind_budget_${userId}_${budget.destinationId}`,
        JSON.stringify(budget)
      )
      return { success: true }
    }

    const { error } = await supabase
      .from('travel_budgets')
      .upsert({
        user_id: userId,
        destination_id: budget.destinationId,
        destination_name: budget.destinationName,
        currency: budget.currency,
        tier: budget.tier,
        number_of_days: budget.durationDays,
        number_of_travelers: budget.travelersCount,
        accommodation_cost: budget.breakdown.accommodation,
        food_cost: budget.breakdown.food,
        transport_cost: budget.breakdown.localTransport,
        activities_cost: budget.breakdown.sightseeing,
        miscellaneous_cost: budget.breakdown.miscellaneous,
        estimated_total: budget.totalBudget,
        per_person_budget: budget.perPersonBudget,
        budget_details: { tips: budget.moneySavingTips },
        updated_at: new Date().toISOString(),
      })

    if (error) return { success: false, error: error.message }
    return { success: true }
  }
}
