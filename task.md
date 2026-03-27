# 一、整体架构设计（推荐方案）

```txt
[用户浏览器]
      ↓
React + shadcn/ui（Vercel部署）
      ↓
Supabase（BaaS）
 ├─ Postgres（数据）
 ├─ Auth（登录）
 ├─ Realtime（可选）
 └─ Storage（头像/图片）
```

---

# 二、技术选型（固定建议）

### 前端

* React（建议 Next.js / Vite 都可）
* UI：shadcn/ui + Tailwind
* 状态管理：

  * 简单用 React Query / Zustand

### 后端（Supabase）

* DB：PostgreSQL
* Auth：Supabase Auth（Google / Email）
* API：直接用 supabase-js

---

# 三、核心数据模型（非常关键）

## 1️⃣ 用户表（profiles）

```sql
create table profiles (
  id uuid primary key references auth.users(id),
  nickname text,
  avatar_url text,
  contact text, -- telegram / 微信
  rating numeric default 0,
  created_at timestamp default now()
);
```

---

## 2️⃣ 拼车信息表（核心表）

```sql
create table listings (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references profiles(id),

  region text,         -- US / TR / CN
  product_type text,   -- apple_one / music / icloud

  price numeric,
  currency text,       -- USD / TRY / CNY

  total_slots int,
  available_slots int,

  description text,

  contact text,        -- 可选（冗余一份）
  status text default 'active', -- active / closed

  created_at timestamp default now()
);
```

---

## 3️⃣ 评论 / 反馈（可选）

```sql
create table comments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id),
  user_id uuid references profiles(id),
  content text,
  created_at timestamp default now()
);
```

---

## 4️⃣ 举报系统（建议必须做）

```sql
create table reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid,
  reason text,
  created_at timestamp default now()
);
```

---

# 四、权限设计（RLS 必开）

Supabase 核心就是 RLS（Row Level Security）

### listings 表策略：

```sql
-- 允许所有人读取
create policy "public read"
on listings for select
using (true);

-- 仅登录用户可创建
create policy "insert own"
on listings for insert
with check (auth.uid() = user_id);

-- 只能改自己的
create policy "update own"
on listings for update
using (auth.uid() = user_id);
```

---

# 五、API 使用方式（前端直接调用）

### 初始化

```ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(URL, ANON_KEY)
```

---

### 获取列表

```ts
const { data } = await supabase
  .from('listings')
  .select('*')
  .eq('status', 'active')
  .order('created_at', { ascending: false })
```

---

### 创建拼车

```ts
await supabase.from('listings').insert({
  user_id,
  region,
  product_type,
  price,
  total_slots,
  available_slots,
  description
})
```

---

# 六、前端页面结构（重点）

## 1️⃣ 首页（核心流量页）

```txt
----------------------------------
| 顶部导航                       |
| 搜索栏 + 筛选                 |
----------------------------------
| 拼车列表（卡片流）            |
|  - 区域                        |
|  - 价格                        |
|  - 剩余位置                    |
----------------------------------
```

---

## 2️⃣ 发布页

```txt
----------------------------------
| 表单                          |
| 区域选择（下拉）              |
| 产品类型                      |
| 价格                          |
| 总人数 / 剩余人数             |
| 联系方式                      |
| 描述                          |
----------------------------------
| 提交按钮                      |
----------------------------------
```

---

## 3️⃣ 详情页

```txt
----------------------------------
| 拼车信息                      |
| 用户信息                      |
| 联系方式                      |
----------------------------------
| 评论区（可选）                |
----------------------------------
```

---

## 4️⃣ 我的发布

```txt
----------------------------------
| 我发布的列表                  |
| 编辑 / 删除                   |
----------------------------------
```

---

# 七、UI 设计建议（shadcn 风格）

### 组件使用：

* Card（列表）
* Dialog（发布弹窗）
* Select（区域选择）
* Badge（标签）
* Input / Textarea
* Button

---

### 卡片设计（核心）

```txt
[Apple One | US]
价格: $5/月

剩余: 3 / 6

描述: 差3人

[联系按钮]
```

---

# 八、核心功能点（按优先级）

## MVP（必须）

* [x] 浏览列表
* [x] 发布拼车
* [x] 筛选（区 / 类型）
* [x] 登录（Google）

---

## 第二阶段

* [ ] 收藏
* [ ] 评论
* [ ] 举报
* [ ] 用户评分

---

## 第三阶段（产品化）

* [ ] 私信（避免联系方式暴露）
* [ ] 自动匹配拼车
* [ ] 推荐算法

---

# 九、关键优化（很重要）

## 1️⃣ 防 spam（必须做）

简单方案：

* 发布频率限制（1分钟1条）
* 最小字段校验
* 黑名单词

---

## 2️⃣ 数据质量

* 下拉选择（不要自由输入）
* price 必须 number

---

## 3️⃣ SEO（流量关键）

页面结构：

```txt
/apple-one-us
/apple-music-tr
```

---

# 十、部署方案

### 前端

* GitHub Pages

### Supabase

* 官方托管（不用管）

---

# 十一、你可以直接这样开始（最短路径）

### 第一步

* 注册 Supabase
* 建表（复制我上面的 SQL）

### 第二步

* React 初始化
* 接入 supabase-js

### 第三步

* 做一个：

  * 列表页
  * 发布页

👉 **1天能上线 MVP**

---
