import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ReportDialog } from '../components/listings/report-dialog';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardTitle } from '../components/ui/card';
import { useListing } from '../hooks/useMarketplace';
import { formatCurrency, formatDateTime, getProductMeta, getRegionMeta } from '../lib/utils';

export function ListingDetailPage() {
  const params = useParams();
  const listingId = params.listingId;
  const listingQuery = useListing(listingId);

  useEffect(() => {
    document.title = '订阅拼车站 | 详情';
  }, []);

  if (listingQuery.isLoading) {
    return <Card className="h-64 animate-pulse bg-white/60" />;
  }

  if (!listingQuery.data) {
    return (
      <Card className="space-y-3">
        <CardTitle>未找到对应的拼车信息</CardTitle>
        <CardDescription>该车位可能已经删除，或者当前 ID 无效。</CardDescription>
        <div>
          <Link to="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const listing = listingQuery.data;
  const product = getProductMeta(listing.product_type);
  const region = getRegionMeta(listing.region);

  async function copyContact() {
    try {
      await navigator.clipboard.writeText(listing.contact);
      window.alert('联系方式已复制。');
    } catch {
      window.alert(`请手动复制：${listing.contact}`);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="space-y-6 p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>{product.label}</Badge>
              <Badge className="bg-lagoon/10 text-lagoon">{region.label}</Badge>
              <Badge className={listing.status === 'active' ? 'bg-gold/20 text-ink' : 'bg-ink/10 text-ink/60'}>
                {listing.status === 'active' ? '可联系' : '已关闭'}
              </Badge>
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold">{product.label}</h1>
              <p className="mt-2 text-base text-ink/60">{region.description}</p>
            </div>
          </div>
          <div className="rounded-[28px] bg-[#fff8ef] px-5 py-4 text-right">
            <div className="text-xs uppercase tracking-[0.16em] text-ink/45">月费</div>
            <div className="mt-2 font-display text-3xl font-bold text-peach">
              {formatCurrency(listing.price, listing.currency)}
            </div>
          </div>
        </div>

        <div className="grid gap-4 rounded-[28px] bg-[#fffaf2] p-5 sm:grid-cols-3">
          <div>
            <div className="text-xs uppercase tracking-[0.14em] text-ink/45">席位情况</div>
            <div className="mt-1 text-lg font-semibold text-ink">
              {listing.available_slots} / {listing.total_slots}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.14em] text-ink/45">发布时间</div>
            <div className="mt-1 text-lg font-semibold text-ink">{formatDateTime(listing.created_at)}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.14em] text-ink/45">发布者评分</div>
            <div className="mt-1 text-lg font-semibold text-ink">{listing.profile?.rating ?? 0} / 5</div>
          </div>
        </div>

        <div className="space-y-3">
          <CardTitle>拼车说明</CardTitle>
          <p className="text-base leading-8 text-ink/75">{listing.description}</p>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="space-y-4 p-6">
          <CardTitle>联系发布者</CardTitle>
          <div className="rounded-[24px] bg-mist p-4">
            <div className="text-sm text-ink/55">联系人</div>
            <div className="mt-1 text-lg font-semibold text-ink">{listing.profile?.nickname}</div>
            <div className="mt-4 text-sm text-ink/55">联系方式</div>
            <div className="mt-1 text-lg font-semibold text-ink">{listing.contact}</div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void copyContact()}>复制联系方式</Button>
            <ReportDialog listingId={listing.id} />
          </div>
        </Card>

      </div>
    </div>
  );
}
