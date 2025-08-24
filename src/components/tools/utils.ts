import type { Weapon, WeaponFilter, WeaponStats } from './types';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'text-green-400';
    case 'low_stock':
      return 'text-yellow-400';
    case 'out_of_stock':
      return 'text-red-400';
    case 'maintenance':
      return 'text-orange-400';
    default:
      return 'text-gray-400';
  }
};

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'available':
      return { text: 'Available', color: 'text-green-400' };
    case 'low_stock':
      return { text: 'Low Stock', color: 'text-yellow-400' };
    case 'out_of_stock':
      return { text: 'Out of Stock', color: 'text-red-400' };
    case 'maintenance':
      return { text: 'Maintenance', color: 'text-orange-400' };
    default:
      return { text: 'Unknown', color: 'text-gray-400' };
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'rifle':
      return 'text-blue-400';
    case 'pistol':
      return 'text-purple-400';
    case 'sniper':
      return 'text-red-400';
    case 'shotgun':
      return 'text-orange-400';
    case 'smg':
      return 'text-green-400';
    case 'lmg':
      return 'text-yellow-400';
    case 'special':
      return 'text-pink-400';
    default:
      return 'text-gray-400';
  }
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const filterWeapons = (weapons: Weapon[], filter: WeaponFilter): Weapon[] => {
  return weapons.filter(weapon => {
    // Category filter
    if (filter.category !== 'all' && weapon.category !== filter.category) {
      return false;
    }

    // Price range filter
    if (weapon.price < filter.priceRange[0] || weapon.price > filter.priceRange[1]) {
      return false;
    }

    // Status filter
    if (filter.status !== 'all' && weapon.status !== filter.status) {
      return false;
    }

    // Search filter
    if (filter.search && !weapon.name.toLowerCase().includes(filter.search.toLowerCase()) &&
        !weapon.description.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }

    return true;
  });
};

export const calculateStats = (weapons: Weapon[]): WeaponStats => {
  const totalWeapons = weapons.length;
  const availableStock = weapons.reduce((sum, weapon) => sum + weapon.totalStock, 0);
  const totalValue = weapons.reduce((sum, weapon) => sum + (weapon.price * weapon.totalStock), 0);
  
  const categories: Record<string, number> = {};
  weapons.forEach(weapon => {
    categories[weapon.category] = (categories[weapon.category] || 0) + 1;
  });

  return {
    totalWeapons,
    availableStock,
    totalValue,
    categories
  };
};

export const sortWeapons = (weapons: Weapon[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): Weapon[] => {
  return [...weapons].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Weapon];
    let bValue: any = b[sortBy as keyof Weapon];

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}; 