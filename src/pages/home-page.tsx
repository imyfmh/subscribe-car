import { useEffect } from 'react';

import { ListingsBoard } from '../components/listings/listings-board';

export function HomePage() {
  useEffect(() => {
    document.title = '订阅拼车站 | 首页';
  }, []);

  return <ListingsBoard />;
}
