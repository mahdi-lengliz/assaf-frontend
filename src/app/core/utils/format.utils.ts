export function formatPrice(value: number): string {
  return Number(value || 0).toLocaleString('fr-TN') + ' TND';
}

export function categoryLabel(name: string): string {
  return name;
}

export function stockInfo(stock: number): { label: string; cls: string; canBuy: boolean } {
  const value = Number(stock || 0);
  if (value <= 0) return { label: 'Rupture de stock', cls: 'stock-out', canBuy: false };
  if (value <= 10) return { label: `Plus que ${value} unites`, cls: 'stock-low', canBuy: true };
  return { label: 'En stock', cls: 'stock-ok', canBuy: true };
}

export function badgeClass(badge: string): string {
  if (badge === 'Bestseller') return 'badge-best';
  if (badge === 'Exclusif' || badge === 'Collection') return 'badge-excl';
  return 'badge-new';
}
