# 订阅拼车站

基于 `Vite + React + TypeScript + Tailwind + Supabase` 的订阅拼车前端项目，按 `task.md` 的 MVP 需求实现了：

- 首页列表浏览
- 区域 / 产品类型 / 关键词筛选
- 发布拼车
- 详情页
- 我的发布（编辑 / 删除）
- Google 登录入口
- 举报入口
- GitHub Pages 友好的 SEO 路径

## 本地运行

```bash
npm install
npm run dev
```

## 生产构建

```bash
npm run build
```

## GitHub Pages 构建

```bash
npm run build:pages
```

这会生成可直接用于 GitHub Pages 的 `docs/` 目录，并以 `/subscribe-car/` 作为静态资源前缀。

## 环境变量

复制 `.env.example` 为 `.env` 后填写：

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_APP_BASE_PATH=/subscribe-car/
```

如果不填写 Supabase 配置，应用会自动退回到本地 demo 数据模式，便于先验证前端流程。

## Supabase 初始化

在 Supabase SQL Editor 中执行 [schema.sql](/root/codex-work/subscribe-car/supabase/schema.sql)。

## 路由

- `/` 首页
- `/publish` 发布页
- `/listing/:listingId` 详情页
- `/my-listings` 我的发布
- `/apple-one-us` 这类 SEO 落地页

## GitHub Pages

- `404.html` 已加入 SPA 回退脚本
- `VITE_APP_BASE_PATH` 默认示例为 `/subscribe-car/`
- 如果你的仓库名不同，改成对应仓库路径即可
