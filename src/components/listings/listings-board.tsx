import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { PRODUCTS, REGIONS } from '../../lib/constants';
import type { ListingFilters } from '../../lib/types';
import { getProductMeta, getRegionMeta } from '../../lib/utils';
import { useListings } from '../../hooks/useMarketplace';
import { Badge } from '../ui/badge';
import { Card, CardDescription, CardTitle } from '../ui/card';
import { ListingCard } from './listing-card';
import { ListingFilters as ListingFiltersPanel } from './listing-filters';

interface ListingsBoardProps {
  title: string;
  subtitle: string;
  presetFilters?: Partial<ListingFilters>;
  eyebrow?: string;
}

export function ListingsBoard({
  title,
  subtitle,
  presetFilters,
  eyebrow = '订阅拼车看板',
}: ListingsBoardProps) {
  const [filters, setFilters] = useState<ListingFilters>({
    region: presetFilters?.region ?? 'ALL',
    productType: presetFilters?.productType ?? 'ALL',
    status: 'active',
    search: '',
  });

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      region: presetFilters?.region ?? current.region ?? 'ALL',
      productType: presetFilters?.productType ?? current.productType ?? 'ALL',
      status: 'active',
    }));
  }, [presetFilters?.productType, presetFilters?.region]);

  const mergedFilters: ListingFilters = {
    ...filters,
    ...presetFilters,
    status: 'active',
  };

  const { data, isLoading, error } = useListings(mergedFilters);

  const stats = useMemo(() => {
    const listings = data ?? [];
    return {
      total: listings.length,
      seats: listings.reduce((sum, item) => sum + item.available_slots, 0),
      users: new Set(listings.map((item) => item.user_id)).size,
    };
  }, [data]);

  const quickLinks = useMemo(
    () =>
      PRODUCTS.flatMap((product) =>
        REGIONS.map((region) => ({
          label: `${product.label} ${region.value}`,
          to: `/${product.slug}-${region.value.toLowerCase()}`,
        })),
      ),
    [],
  );

  const regionLabel =
    mergedFilters.region && mergedFilters.region !== 'ALL'
      ? getRegionMeta(mergedFilters.region).label
      : '全部区域';
  const productLabel =
    mergedFilters.productType && mergedFilters.productType !== 'ALL'
      ? getProductMeta(mergedFilters.productType).label
      : '全部产品';

  return (
    <section className="space-y-8">
      <Card className="overflow-hidden border-none bg-ink p-0 text-white shadow-[0_32px_80px_rgba(21,33,50,0.25)]">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.35fr_0.85fr] lg:p-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge className="bg-white/12 text-white">{eyebrow}</Badge>
              <div className="space-y-4">
                <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
                <p className="max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{subtitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-full border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/75 transition hover:border-white/30 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <Card className="border-white/10 bg-white/10 text-white shadow-none">
              <CardDescription className="text-white/55">当前筛选</CardDescription>
              <CardTitle className="mt-2 text-white">
                {productLabel} · {regionLabel}
              </CardTitle>
            </Card>
            <Card className="border-white/10 bg-white/10 text-white shadow-none">
              <CardDescription className="text-white/55">活跃车位</CardDescription>
              <CardTitle className="mt-2 text-white">{stats.total}</CardTitle>
            </Card>
            <Card className="border-white/10 bg-white/10 text-white shadow-none">
              <CardDescription className="text-white/55">可加入席位</CardDescription>
              <CardTitle className="mt-2 text-white">{stats.seats}</CardTitle>
            </Card>
          </div>
        </div>
      </Card>

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
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="bg-[#fffaf2]">
          <CardTitle>数据质量约束</CardTitle>
          <CardDescription className="mt-2">
            区域和产品类型都使用下拉选择，价格只能输入数字，避免自由文本污染数据。
          </CardDescription>
        </Card>
        <Card className="bg-[#f4fbf7]">
          <CardTitle>防 spam</CardTitle>
          <CardDescription className="mt-2">
            发布频率限制为 1 分钟 1 条，并内置最小字段校验与黑名单词过滤。
          </CardDescription>
        </Card>
        <Card className="bg-[#fff6f0]">
          <CardTitle>部署路径</CardTitle>
          <CardDescription className="mt-2">
            已预留 GitHub Pages 404 回退，支持类似 `/apple-one-us` 的落地页路径。
          </CardDescription>
        </Card>
      </div>
    </section>
  );
}
