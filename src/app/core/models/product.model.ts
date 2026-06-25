export interface Product {
  id: number;
  name: string;
  sub: string;
  perfumeSize: number | null;
  size?: string;
  price: number;
  categoryId: number;
  cat?: number;
  categoryName?: string;
  emoji: string;
  badge: string;
  description: string;
  stock: number;
  imageUrl?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  collection: boolean;
  isCollection?: boolean;
  notes: string[];
}

export interface ProductRequest {
  name: string;
  sub: string;
  perfumeSize: number | null;
  price: number | null;
  categoryId: number;
  emoji: string;
  badge: string;
  description: string;
  stock: number;
  imageUrl: string;
  imageUrl2: string;
  collection: boolean;
  notes?: string[];
}
