'use client';

import { useEffect, useState } from 'react';
import ShopCard from '../ShopCard';

type ShopFeature = {
  type: 'Feature';
  properties: {
    name: string;
    neighborhood: string;
    website: string;
    address: string;
    roaster?: string;
    photo?: string;
    uuid: string;
  };
  geometry: { type: 'Point'; coordinates: [number, number] };
};

export default function FeaturedShop() {
  const [shop, setShop] = useState<ShopFeature | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/featured-shop', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ShopFeature = await res.json();
        if (!cancelled) setShop(data);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? 'Failed to load featured shop');
      }
    };

    fetchFeatured();
    return () => { cancelled = true; };
  }, []);

  if (err) return null; // or render a tiny fallback
  if (!shop) return null; // or a skeleton

  return (
    <div className="sm:col-span-2">
      <h3 className="text-lg font-bold mb-2">Featured shop</h3>
      <div className="list-none">
        <ShopCard featured shop={shop as any} handleKeyPress={() => {}} />
      </div>
    </div>
  );
}
