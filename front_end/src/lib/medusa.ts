// Medusa JS Client for v2.20.1
// Using the Medusa JS SDK

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_dev_123456789';

// Create a simple fetch wrapper for Medusa API
// The actual Medusa JS SDK v2 uses a different client pattern

interface MedusaRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  query?: Record<string, string>;
  headers?: Record<string, string>;
}

async function medusaFetch<T>(path: string, options: MedusaRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, headers = {} } = options;
  
  const url = new URL(`${MEDUSA_BACKEND_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// Product API
export async function fetchProducts(params?: {
  limit?: number;
  offset?: number;
  category_id?: string;
  collection_id?: string;
  q?: string;
  fields?: string;
}) {
  return medusaFetch<{ products: unknown[]; count: number }>('/store/products', {
    query: params as Record<string, string>,
  });
}

export async function fetchProduct(id: string, fields?: string) {
  return medusaFetch<{ product: unknown }>(`/store/products/${id}`, {
    query: fields ? { fields } : undefined,
  });
}

export async function fetchCategories() {
  return medusaFetch<{ product_categories: unknown[] }>('/store/product-categories', {
    query: { limit: '100' },
  });
}

export async function fetchCollections() {
  return medusaFetch<{ collections: unknown[] }>('/store/collections', {
    query: { limit: '100' },
  });
}

// Cart API
export async function createCart() {
  return medusaFetch<{ cart: unknown }>('/store/carts', { method: 'POST' });
}

export async function getCart(id: string) {
  return medusaFetch<{ cart: unknown }>(`/store/carts/${id}`);
}

export async function addToCart(cartId: string, variantId: string, quantity = 1) {
  return medusaFetch<{ cart: unknown }>(`/store/carts/${cartId}/line-items`, {
    method: 'POST',
    body: { variant_id: variantId, quantity },
  });
}

export async function updateCartLineItem(cartId: string, lineItemId: string, quantity: number) {
  return medusaFetch<{ cart: unknown }>(`/store/carts/${cartId}/line-items/${lineItemId}`, {
    method: 'POST',
    body: { quantity },
  });
}

export async function removeFromCart(cartId: string, lineItemId: string) {
  return medusaFetch<{ cart: unknown }>(`/store/carts/${cartId}/line-items/${lineItemId}`, {
    method: 'DELETE',
  });
}

export async function completeCart(cartId: string) {
  return medusaFetch<{ cart: unknown; order: unknown }>(`/store/carts/${cartId}/complete`, {
    method: 'POST',
  });
}