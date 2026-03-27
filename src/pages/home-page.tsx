import { useEffect } from 'react';

import { ListingsBoard } from '../components/listings/listings-board';

export function HomePage() {
  useEffect(() => {
    document.title = '订阅拼车站 | 首页';
  }, []);

  return (
    <ListingsBoard
      eyebrow="首页"
      title="把 Apple One、Music、iCloud 的车位，做成更干净的公开市场。"
      subtitle="支持浏览、发布、筛选、Google 登录和 GitHub Pages 部署，面向真实 Supabase 数据源。"
    />
  );
}
