import { LOW_STOCK_THRESHOLD, SOLD_OUT_QUANTITY, type StockStatus } from '../config/stock'
import type { Product } from '../data/products'

export function getStockStatus(quantity: number): StockStatus {
  if (quantity <= SOLD_OUT_QUANTITY) return 'soldOut'
  if (quantity < LOW_STOCK_THRESHOLD) return 'low'
  return 'enough'
}

export type StockSummary = Record<StockStatus, number> & { total: number }

export function summarize(products: Product[]): StockSummary {
  const summary: StockSummary = { total: products.length, enough: 0, low: 0, soldOut: 0 }
  for (const p of products) summary[getStockStatus(p.quantity)] += 1
  return summary
}
