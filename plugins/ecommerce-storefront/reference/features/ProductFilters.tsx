// features/ProductFilters.tsx — Full filtering feature for product listing pages
"use client"
import { useQueryState } from "nuqs"
import { useCallback } from "react"

interface FilterOption {
  id: string
  value: string
  label: string
  count?: number
}

interface FilterGroup {
  id: string
  title: string
  type: "checkbox" | "radio" | "range"
  options: FilterOption[]
}

interface ProductFiltersProps {
  groups: FilterGroup[]
}

export function ProductFilters({ groups }: ProductFiltersProps) {
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" })
  const [minPrice, setMinPrice] = useQueryState("min_price", { defaultValue: "" })
  const [maxPrice, setMaxPrice] = useQueryState("max_price", { defaultValue: "" })

  const clearFilters = useCallback(() => {
    setSort(null)
    setMinPrice(null)
    setMaxPrice(null)
  }, [setSort, setMinPrice, setMaxPrice])

  return (
    <aside className="product-filters" aria-label="Product filters">
      <div className="product-filters__header">
        <h2 className="product-filters__title">Filters</h2>
        <button
          className="product-filters__clear"
          onClick={clearFilters}
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      </div>

      {/* Sort */}
      <div className="filter-group">
        <h3 className="filter-group__title">Sort by</h3>
        <select
          className="filter-group__select"
          value={sort}
          onChange={e => setSort(e.target.value || null)}
          aria-label="Sort products"
        >
          <option value="">Relevance</option>
          <option value="created_at">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <h3 className="filter-group__title">Price</h3>
        <div className="filter-group__range">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value || null)}
            className="filter-group__range-input"
            aria-label="Minimum price"
            min={0}
          />
          <span aria-hidden="true">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value || null)}
            className="filter-group__range-input"
            aria-label="Maximum price"
            min={0}
          />
        </div>
      </div>

      {/* Dynamic filter groups */}
      {groups.map(group => (
        <FilterGroupSection key={group.id} group={group} />
      ))}
    </aside>
  )
}

function FilterGroupSection({ group }: { group: FilterGroup }) {
  const [value, setValue] = useQueryState(group.id, { defaultValue: "" })
  const selected = value ? value.split(",") : []

  const toggle = (optionValue: string) => {
    const next = selected.includes(optionValue)
      ? selected.filter(v => v !== optionValue)
      : [...selected, optionValue]
    setValue(next.length ? next.join(",") : null)
  }

  return (
    <div className="filter-group">
      <h3 className="filter-group__title">{group.title}</h3>
      <ul className="filter-group__options" role="group" aria-label={group.title}>
        {group.options.map(option => (
          <li key={option.id}>
            <label className="filter-option">
              <input
                type="checkbox"
                className="filter-option__checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggle(option.value)}
              />
              <span className="filter-option__label">{option.label}</span>
              {option.count !== undefined && (
                <span className="filter-option__count">({option.count})</span>
              )}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
