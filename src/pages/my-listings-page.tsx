import { useEffect, useState } from 'react';

import { ListingForm } from '../components/listings/listing-form';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardTitle } from '../components/ui/card';
import { Dialog } from '../components/ui/dialog';
import { useAuth } from '../hooks/useAuth';
import { useDeleteListing, useMyListings, useUpdateListing } from '../hooks/useMarketplace';
import type { Listing } from '../lib/types';
import { formatCurrency, formatDateTime, getProductMeta, getRegionMeta } from '../lib/utils';

function toPayload(listing: Listing) {
  return {
    region: listing.region,
    product_type: listing.product_type,
    price: listing.price,
    currency: listing.currency,
    total_slots: listing.total_slots,
    available_slots: listing.available_slots,
    description: listing.description,
    contact: listing.contact,
  };
}

export function MyListingsPage() {
  const { user, signInWithGoogle } = useAuth();
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const myListingsQuery = useMyListings(user?.id);
  const updateMutation = useUpdateListing(user);
  const deleteMutation = useDeleteListing(user);

  useEffect(() => {
    document.title = '订阅拼车站 | 我的发布';
  }, []);

  if (!user) {
    return (
      <Card className="mx-auto max-w-2xl space-y-4 p-8 text-center">
        <CardTitle>登录后才能管理自己的车位</CardTitle>
        <CardDescription>
          当前页面包含“编辑 / 删除”操作，和需求文档中的“我的发布”完全对应。
        </CardDescription>
        <div className="flex justify-center">
          <Button onClick={() => void signInWithGoogle()}>Google 登录</Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <section className="space-y-6">
        <Card className="space-y-3 p-8">
          <CardTitle>我的发布</CardTitle>
          <CardDescription>这里集中管理你创建的拼车信息，支持编辑和删除。</CardDescription>
        </Card>

        {myListingsQuery.isLoading ? (
          <Card className="h-48 animate-pulse bg-white/60" />
        ) : myListingsQuery.data?.length ? (
          <div className="grid gap-5">
            {myListingsQuery.data.map((listing) => {
              const product = getProductMeta(listing.product_type);
              const region = getRegionMeta(listing.region);

              return (
                <Card key={listing.id} className="grid gap-5 p-6 lg:grid-cols-[1fr_auto]">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge>{product.label}</Badge>
                      <Badge className="bg-lagoon/10 text-lagoon">{region.value}</Badge>
                      <Badge>{listing.status === 'active' ? 'active' : 'closed'}</Badge>
                    </div>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-2xl font-semibold text-ink">{product.label}</h2>
                        <p className="mt-2 text-sm text-ink/60">{listing.description}</p>
                      </div>
                      <div className="rounded-[22px] bg-mist px-4 py-3">
                        <div className="text-xs uppercase tracking-[0.14em] text-ink/45">价格</div>
                        <div className="mt-1 text-xl font-bold text-peach">
                          {formatCurrency(listing.price, listing.currency)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-5 text-sm text-ink/60">
                      <span>剩余 {listing.available_slots} / {listing.total_slots}</span>
                      <span>联系 {listing.contact}</span>
                      <span>发布于 {formatDateTime(listing.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-start gap-3">
                    <Button variant="secondary" onClick={() => setEditingListing(listing)}>
                      编辑
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => void deleteMutation.mutateAsync(listing.id)}
                      disabled={deleteMutation.isPending}
                    >
                      删除
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="space-y-3">
            <CardTitle>还没有发布任何车位</CardTitle>
            <CardDescription>先去发布页创建第一条拼车信息，列表会同步回到这里。</CardDescription>
          </Card>
        )}
      </section>

      <Dialog
        open={Boolean(editingListing)}
        onClose={() => setEditingListing(null)}
        title="编辑拼车信息"
        description="只允许修改你自己的发布。"
      >
        {editingListing ? (
          <ListingForm
            initialValues={toPayload(editingListing)}
            submitLabel="保存修改"
            isSubmitting={updateMutation.isPending}
            onSubmit={async (payload) => {
              await updateMutation.mutateAsync({ listingId: editingListing.id, payload });
              setEditingListing(null);
            }}
          />
        ) : null}
      </Dialog>
    </>
  );
}
