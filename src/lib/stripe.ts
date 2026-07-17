import Stripe from 'stripe'

let client: Stripe | null = null

export function getStripe(): Stripe | null {
  const key = process.env.ABI_STRIPE_SECRET_KEY
  if (!key) return null
  if (!client) client = new Stripe(key)
  return client
}

export function priceIdFor(interval: 'month' | 'year'): string | undefined {
  return interval === 'year'
    ? process.env.ABI_STRIPE_PREMIUM_YEARLY_PRICE_ID
    : process.env.ABI_STRIPE_PREMIUM_MONTHLY_PRICE_ID
}
