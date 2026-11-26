import type { Page } from '@playwright/test'
import type { Product, Sale } from '../../src/lib/api'
import { fakeJwt } from '../helpers'

/** Simple mocks for the data API, shaped by contracts/openapi.yaml */

/** 3 sales (contract example `some`) */
const threeSales: Sale[] = [
  {
    id: 'S-1042',
    date: '2026-11-18T10:24:00Z',
    customer: 'Northwind Ltd',
    product: 'Annual licence',
    quantity: 2,
    amount: 4200.0,
    currency: 'EUR',
    status: 'paid',
  },
  {
    id: 'S-1043',
    date: '2026-11-18T14:02:00Z',
    customer: 'Baltic Trade Co.',
    product: 'Onboarding package',
    quantity: 1,
    amount: 12800.0,
    currency: 'EUR',
    status: 'pending',
  },
  {
    id: 'S-1044',
    date: '2026-11-19T08:40:00Z',
    customer: 'Green Leaf Studio',
    product: 'Monthly licence',
    quantity: 4,
    amount: 980.0,
    currency: 'EUR',
    status: 'cancelled',
  },
]

/** 4 products (contract example `some` + two more) */
const fourProducts: Product[] = [
  {
    id: 'P-001',
    name: 'Annual licence',
    sku: 'LIC-ANNUAL',
    price: 2100.0,
    currency: 'EUR',
    stock: 120,
    active: true,
  },
  {
    id: 'P-002',
    name: 'Monthly licence',
    sku: 'LIC-MONTH',
    price: 245.0,
    currency: 'EUR',
    stock: 0,
    active: false,
  },
  {
    id: 'P-003',
    name: 'Onboarding package',
    sku: 'SRV-ONBOARD',
    price: 12800.0,
    currency: 'EUR',
    stock: 15,
    active: true,
  },
  {
    id: 'P-004',
    name: 'Support hours',
    sku: 'SRV-SUPPORT',
    price: 90.5,
    currency: 'EUR',
    stock: 1000,
    active: true,
  },
]

// ---- One named mock per scenario ----

/** POST /api/login/auth → 200, pseudo JWT as plain text (like the real backend) */
export const mockLoginSuccess = (page: Page, sub = 'demo-user') =>
  page.route('**/api/login/auth', (route) =>
    route.fulfill({ contentType: 'text/plain', body: fakeJwt({ sub }) }),
  )

/** GET /api/sales → 200, 3 sales */
export const mockThreeSales = (page: Page) =>
  page.route('**/api/sales', (route) => route.fulfill({ json: threeSales }))

/** GET /api/sales → 200, [] (no sales) */
export const mockNoSales = (page: Page) =>
  page.route('**/api/sales', (route) => route.fulfill({ json: [] }))

/** GET /api/products → 200, 4 products */
export const mockFourProducts = (page: Page) =>
  page.route('**/api/products', (route) => route.fulfill({ json: fourProducts }))
