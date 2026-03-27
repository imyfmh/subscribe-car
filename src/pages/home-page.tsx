import { useEffect } from 'react';

import { ListingsBoard } from '../components/listings/listings-board';

export function HomePage() {
  useEffect(() => {
    document.title = '订阅拼车站 | 首页';
  }, []);

  return (
    <ListingsBoard
      eyebrow="MVP 首页"
      title="把 Apple One、Music、iCloud 的车位，做成更干净的公开市场。"
      subtitle="支持浏览、发布、筛选、Google 登录和 GitHub Pages 部署。未接入 Supabase 时自动使用本地演示数据，便于先完成前端联调。"
    />
  );
}
