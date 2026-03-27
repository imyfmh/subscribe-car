import type { Currency, ProductType, Region } from './types';

export const REGIONS: Array<{
  value: Region;
  label: string;
  currency: Currency;
  description: string;
}> = [
  { value: 'US', label: '美国区', currency: 'USD', description: '适合 Apple One / Music 美区家庭组' },
  { value: 'TR', label: '土耳其区', currency: 'TRY', description: '低价敏感用户常见选择' },
  { value: 'CN', label: '中国区', currency: 'CNY', description: '本地支付和沟通更方便' },
];

export const PRODUCTS: Array<{
  value: ProductType;
  label: string;
  slug: string;
  description: string;
}> = [
  { value: 'apple_one', label: 'Apple One', slug: 'apple-one', description: '家庭订阅整合套餐' },
  { value: 'music', label: 'Apple Music', slug: 'apple-music', description: '单独音乐订阅拼车' },
  { value: 'icloud', label: 'iCloud+', slug: 'icloud', description: '云存储共享订阅' },
];

export const BLACKLIST_WORDS = ['刷单', '赌场', 'vpn', '灰产', '赌博', '代付', '发票'];

export const PUBLISH_INTERVAL_MS = 60_000;

export const APP_NAME = '订阅拼车站';

export const DEFAULT_CONTACT_PLACEHOLDER = 'Telegram / 微信 / Email';
