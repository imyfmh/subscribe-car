import { Link } from 'react-router-dom';

import type { Listing } from '../../lib/types';
import { formatCurrency, formatDateTime, getListingSeoPath, getProductMeta, getRegionMeta } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export function ListingCard({ listing }: { listing: Listing }) {
  const region = getRegionMeta(listing.region);
  const product = getProductMeta(listing.product_type);

  return (
    <Card className="group flex h-full flex-col gap-5 p-5 transition duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge>{product.label}</Badge>
            <Badge className="bg-lagoon/10 text-lagoon">{region.value}</Badge>
            <Badge className={listing.status === 'active' ? 'bg-gold/25 text-ink' : 'bg-ink/10 text-ink/60'}>
              {listing.status === 'active' ? '可加入' : '已满员'}
            </Badge>
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold leading-tight">{product.label}</h3>
            <p className="mt-1 text-sm text-ink/60">{region.label}</p>
          </div>
        </div>
        <div className="rounded-[22px] bg-mist px-4 py-3 text-right">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">价格</div>
          <div className="mt-1 font-display text-2xl font-bold text-peach">
            {formatCurrency(listing.price, listing.currency)}
          </div>
          <div className="text-xs text-ink/55">按月</div>
        </div>
      </div>

      <div className="grid gap-3 rounded-[24px] bg-[#fffaf2] p-4 text-sm text-ink/70 sm:grid-cols-3">
        <div>
          <div className="text-xs uppercase tracking-[0.14em] text-ink/45">剩余位置</div>
          <div className="mt-1 text-base font-semibold text-ink">
            {listing.available_slots} / {listing.total_slots}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.14em] text-ink/45">发布者</div>
          <div className="mt-1 text-base font-semibold text-ink">{listing.profile?.nickname ?? '匿名用户'}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.14em] text-ink/45">发布时间</div>
          <div className="mt-1 text-base font-semibold text-ink">{formatDateTime(listing.created_at)}</div>
        </div>
      </div>

      <p className="line-clamp-3 min-h-[72px] text-sm leading-6 text-ink/70">{listing.description}</p>

      <div className="mt-auto flex flex-wrap items-center gap-3">
        <Link to={`/listing/${listing.id}`} className="flex-1">
          <Button className="w-full">查看详情</Button>
        </Link>
        <Link to={getListingSeoPath(listing)} className="flex-1">
          <Button variant="secondary" className="w-full">
            SEO 落地页
          </Button>
        </Link>
      </div>
    </Card>
  );
}
