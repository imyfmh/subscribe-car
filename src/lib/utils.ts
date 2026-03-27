import { PRODUCTS, REGIONS } from './constants';
import type { Currency, Listing, ProductType, Region } from './types';

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

export function getRegionMeta(region: Region) {
  return REGIONS.find((item) => item.value === region) ?? REGIONS[0];
}

export function getProductMeta(productType: ProductType) {
  return PRODUCTS.find((item) => item.value === productType) ?? PRODUCTS[0];
}

export function formatCurrency(value: number, currency: Currency) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function getListingSeoPath(input: Pick<Listing, 'product_type' | 'region'>) {
  const product = getProductMeta(input.product_type);
  return `/${product.slug.toLowerCase()}-${input.region.toLowerCase()}`;
}

export function parseSeoSlug(slug: string) {
  const lowerSlug = slug.toLowerCase();
  const region = REGIONS.find((item) => lowerSlug.endsWith(`-${item.value.toLowerCase()}`));

  if (!region) {
    return null;
  }

  const productSlug = lowerSlug.slice(0, -(`-${region.value.toLowerCase()}`.length));
  const product = PRODUCTS.find((item) => item.slug === productSlug);

  if (!product) {
    return null;
  }

  return {
    region: region.value,
    productType: product.value,
  };
}

export function getAvatarFallback(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || 'U';
}

export function normalizeSearchText(text: string) {
  return text.trim().toLowerCase();
}

export function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
