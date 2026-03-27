import { useEffect, useState } from 'react';

import type { ListingFilters } from '../../lib/types';
import { useListings } from '../../hooks/useMarketplace';
import { Card, CardDescription, CardTitle } from '../ui/card';
import { ListingCard } from './listing-card';
import { ListingFilters as ListingFiltersPanel } from './listing-filters';

interface ListingsBoardProps {
  presetFilters?: Partial<ListingFilters>;
}

export function ListingsBoard({ presetFilters }: ListingsBoardProps) {
  const [filters, setFilters] = useState<ListingFilters>({
    region: presetFilters?.region ?? 'ALL',
    productType: presetFilters?.productType ?? 'ALL',
    status: 'ALL',
    search: '',
  });

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      region: presetFilters?.region ?? current.region ?? 'ALL',
      productType: presetFilters?.productType ?? current.productType ?? 'ALL',
      status: 'ALL',
    }));
  }, [presetFilters?.productType, presetFilters?.region]);

  const mergedFilters: ListingFilters = {
    ...filters,
    ...presetFilters,
    status: 'ALL',
  };

  const { data, isLoading, error } = useListings(mergedFilters);

  return (
    <section className="space-y-8">
      <ListingFiltersPanel
        filters={filters}
        onChange={setFilters}
        disabledProduct={Boolean(presetFilters?.productType)}
        disabledRegion={Boolean(presetFilters?.region)}
      />

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="h-[320px] animate-pulse bg-white/60" />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardTitle>加载失败</CardTitle>
          <CardDescription className="mt-2">{error.message}</CardDescription>
        </Card>
      ) : data?.length ? (
        <div className="relative z-0 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.map((listing) => (
            <div key={listing.id} className="animate-fade-up opacity-0" style={{ animationDelay: '80ms' }}>
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      ) : (
        <Card className="space-y-3">
          <CardTitle>没有找到符合条件的车位</CardTitle>
          <CardDescription>
            可以尝试切换区域、产品类型，或者直接前往发布页创建新的拼车信息。
          </CardDescription>
        </Card>
      )}
    </section>
  );
}
