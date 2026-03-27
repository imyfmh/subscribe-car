import { PRODUCTS, REGIONS } from '../../lib/constants';
import type { ListingFilters } from '../../lib/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';

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
  return (
    <div className="grid gap-3 rounded-[30px] border border-white/60 bg-white/80 p-4 shadow-float backdrop-blur lg:grid-cols-[1.4fr_0.9fr_0.9fr_auto]">
      <Input
        value={filters.search ?? ''}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
        placeholder="搜索描述、联系方式或发布者"
      />
      <Select
        value={filters.region ?? 'ALL'}
        disabled={disabledRegion}
        onChange={(event) =>
          onChange({
            ...filters,
            region: event.target.value as ListingFilters['region'],
          })
        }
      >
        <option value="ALL">全部区域</option>
        {REGIONS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
      <Select
        value={filters.productType ?? 'ALL'}
        disabled={disabledProduct}
        onChange={(event) =>
          onChange({
            ...filters,
            productType: event.target.value as ListingFilters['productType'],
          })
        }
      >
        <option value="ALL">全部产品</option>
        {PRODUCTS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
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
