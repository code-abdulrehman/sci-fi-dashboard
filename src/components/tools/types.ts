export interface Weapon {
  id: string;
  name: string;
  price: number;
  range: string;
  usage: string;
  description: string;
  image: string;
  totalStock: number;
  category: 'rifle' | 'pistol' | 'sniper' | 'shotgun' | 'smg' | 'lmg' | 'special';
  caliber: string;
  weight: string;
  length: string;
  fireRate: string;
  magazine: string;
  status: 'available' | 'low_stock' | 'out_of_stock' | 'maintenance';
}

export interface WeaponFilter {
  category: string;
  priceRange: [number, number];
  status: string;
  search: string;
}

export interface WeaponStats {
  totalWeapons: number;
  availableStock: number;
  totalValue: number;
  categories: Record<string, number>;
} 