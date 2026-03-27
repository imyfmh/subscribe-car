import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { ListingsBoard } from '../components/listings/listings-board';
import { parseSeoSlug } from '../lib/utils';

export function SeoCollectionPage() {
  const params = useParams();
  const parsed = params.seoSlug ? parseSeoSlug(params.seoSlug) : null;

  useEffect(() => {
    document.title = '订阅拼车站 | SEO 列表页';
  }, []);

  if (!parsed) {
    return <Navigate to="/" replace />;
  }

  return (
    <ListingsBoard
      eyebrow="SEO 落地页"
      title={`${parsed.region} 区 ${parsed.productType === 'apple_one' ? 'Apple One' : parsed.productType === 'music' ? 'Apple Music' : 'iCloud+'} 拼车列表`}
      subtitle="该路径可直接作为搜索引擎收录入口，保留产品和区域的可读语义。"
      presetFilters={{
        region: parsed.region,
        productType: parsed.productType,
      }}
    />
  );
}
