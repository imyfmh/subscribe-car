import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppShell } from './components/layout/app-shell';
import { HomePage } from './pages/home-page';
import { ListingDetailPage } from './pages/listing-detail-page';
import { MyListingsPage } from './pages/my-listings-page';
import { NotFoundPage } from './pages/not-found-page';
import { PublishPage } from './pages/publish-page';
import { SeoCollectionPage } from './pages/seo-collection-page';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/publish" element={<PublishPage />} />
          <Route path="/listing/:listingId" element={<ListingDetailPage />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/:seoSlug" element={<SeoCollectionPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
