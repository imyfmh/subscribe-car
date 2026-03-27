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
      presetFilters={{
        region: parsed.region,
        productType: parsed.productType,
      }}
    />
  );
}
