import { SOLD_OUT_QUANTITY, type StockStatus } from '../config/stock'
import type { Product } from '../data/products'

export function getStockStatus(quantity: number, lowThreshold: number): StockStatus {
  if (quantity <= SOLD_OUT_QUANTITY) return 'soldOut'
  if (quantity < lowThreshold) return 'low'
  return 'enough'
}

export type StockSummary = Record<StockStatus, number> & { total: number }

export function summarize(products: Product[], lowThreshold: number): StockSummary {
  const summary: StockSummary = { total: products.length, enough: 0, low: 0, soldOut: 0 }
  for (const p of products) summary[getStockStatus(p.quantity, lowThreshold)] += 1
  return summary
}
