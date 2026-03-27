import { PRODUCTS, REGIONS } from '../../lib/constants';
import type { ListingFilters } from '../../lib/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, type SelectOption } from '../ui/select';

interface ListingFiltersProps {
  filters: ListingFilters;
  onChange: (nextFilters: ListingFilters) => void;
  disabledRegion?: boolean;
  disabledProduct?: boolean;
}

export function ListingFilters({
  filters,
  onChange,
  disabledRegion = false,
  disabledProduct = false,
}: ListingFiltersProps) {
  const regionOptions: SelectOption[] = [
    { value: 'ALL', label: '全部区域' },
    ...REGIONS.map((item) => ({
      value: item.value,
      label: item.label,
      description: item.description,
    })),
  ];

  const productOptions: SelectOption[] = [
    { value: 'ALL', label: '全部产品' },
    ...PRODUCTS.map((item) => ({
      value: item.value,
      label: item.label,
      description: item.description,
    })),
  ];

  return (
    <div className="relative z-40 grid gap-3 rounded-[30px] border border-white/60 bg-white/80 p-4 shadow-float backdrop-blur lg:grid-cols-[1.4fr_0.9fr_0.9fr_auto]">
      <Input
        value={filters.search ?? ''}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
        placeholder="搜索描述、联系方式或发布者"
      />
      <Select
        value={filters.region ?? 'ALL'}
        options={regionOptions}
        disabled={disabledRegion}
        onChange={(value) =>
          onChange({
            ...filters,
            region: value as ListingFilters['region'],
          })
        }
      />
      <Select
        value={filters.productType ?? 'ALL'}
        options={productOptions}
        disabled={disabledProduct}
        onChange={(value) =>
          onChange({
            ...filters,
            productType: value as ListingFilters['productType'],
          })
        }
      />
      <Button
        variant="ghost"
        onClick={() =>
          onChange({
            region: disabledRegion ? filters.region : 'ALL',
            productType: disabledProduct ? filters.productType : 'ALL',
            status: 'active',
            search: '',
          })
        }
      >
        重置
      </Button>
    </div>
  );
}
