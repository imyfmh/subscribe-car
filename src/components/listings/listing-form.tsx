import { useMemo, useState } from 'react';

import { DEFAULT_CONTACT_PLACEHOLDER, PRODUCTS, REGIONS } from '../../lib/constants';
import type { ListingPayload } from '../../lib/types';
import { getRegionMeta } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';

const defaultValues: ListingPayload = {
  region: 'US',
  product_type: 'apple_one',
  price: 5,
  currency: 'USD',
  total_slots: 6,
  available_slots: 3,
  description: '',
  contact: '',
};

interface ListingFormProps {
  initialValues?: ListingPayload;
  defaultContact?: string;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (payload: ListingPayload) => Promise<void> | void;
}

export function ListingForm({
  initialValues,
  defaultContact,
  submitLabel,
  isSubmitting = false,
  onSubmit,
}: ListingFormProps) {
  const [values, setValues] = useState<ListingPayload>(() => ({
    ...defaultValues,
    ...initialValues,
    contact: initialValues?.contact ?? defaultContact ?? '',
  }));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const regionMeta = useMemo(() => getRegionMeta(values.region), [values.region]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    try {
      await onSubmit(values);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '提交失败，请稍后再试。');
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">区域</span>
          <Select
            value={values.region}
            onChange={(event) => {
              const region = event.target.value as ListingPayload['region'];
              setValues((current) => ({
                ...current,
                region,
                currency: getRegionMeta(region).currency,
              }));
            }}
          >
            {REGIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
          <p className="text-xs text-ink/55">{regionMeta.description}</p>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">产品类型</span>
          <Select
            value={values.product_type}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                product_type: event.target.value as ListingPayload['product_type'],
              }))
            }
          >
            {PRODUCTS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">价格</span>
          <Input
            type="number"
            min="0.1"
            step="0.1"
            value={values.price}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                price: Number(event.target.value),
              }))
            }
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">币种</span>
          <Input value={values.currency} readOnly />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">总人数</span>
          <Input
            type="number"
            min="2"
            max="6"
            step="1"
            value={values.total_slots}
            onChange={(event) =>
              setValues((current) => {
                const totalSlots = Number(event.target.value);
                return {
                  ...current,
                  total_slots: totalSlots,
                  available_slots: Math.min(current.available_slots, totalSlots),
                };
              })
            }
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">剩余人数</span>
          <Input
            type="number"
            min="0"
            max={values.total_slots}
            step="1"
            value={values.available_slots}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                available_slots: Number(event.target.value),
              }))
            }
          />
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-ink">联系方式</span>
        <Input
          placeholder={DEFAULT_CONTACT_PLACEHOLDER}
          value={values.contact}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              contact: event.target.value,
            }))
          }
        />
      </label>

      <label className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-ink">描述</span>
          <span className="text-xs text-ink/45">{values.description.length} / 280</span>
        </div>
        <Textarea
          maxLength={280}
          placeholder="例如：稳定美区家庭组，账单周期固定，每月 6 日扣费，差 3 人。"
          value={values.description}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
        />
      </label>

      {errorMessage ? (
        <div className="rounded-2xl border border-[#f4b2a8] bg-[#fff3f1] px-4 py-3 text-sm text-[#8a2d1d]">
          {errorMessage}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/60">已启用最小字段校验、敏感词过滤和 1 分钟发布频率限制。</p>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? '提交中...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
