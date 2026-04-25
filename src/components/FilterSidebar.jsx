import { useContext, useEffect, useRef, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { categories } from '../data/products'

function FilterSidebar() {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedBrands,
    setSelectedBrands,
    minRating,
    setMinRating,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    lowestPrice,
    highestPrice,
    brands,
    resetFilters,
  } = useContext(ShopContext)

  const [brandMenuOpen, setBrandMenuOpen] = useState(false)
  const brandWrapRef = useRef(null)

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!brandWrapRef.current?.contains(event.target)) {
        setBrandMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const handleBrandToggle = (brand) => {
    setSelectedBrands((current) =>
      current.includes(brand) ? current.filter((item) => item !== brand) : [...current, brand],
    )
  }

  const brandTriggerLabel =
    selectedBrands.length === 0
      ? 'All brands'
      : selectedBrands.length === 1
        ? selectedBrands[0]
        : `${selectedBrands.length} brands selected`

  const handleMinPriceChange = (value) => {
    const nextMin = Number(value)
    setMinPrice(nextMin)
    if (nextMin > maxPrice) {
      setMaxPrice(nextMin)
    }
  }

  const handleMaxPriceChange = (value) => {
    const nextMax = Number(value)
    setMaxPrice(nextMax)
    if (nextMax < minPrice) {
      setMinPrice(nextMax)
    }
  }

  return (
    <aside className="sidebar">
      <h3>Filters</h3>
      <p>Product Categories</p>
      <div className="filter-list">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={selectedCategory === category ? 'active' : ''}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="filter-group">
        <p>Brand</p>
        <div className={`brand-multi-wrap ${brandMenuOpen ? 'is-open' : ''}`} ref={brandWrapRef}>
          <button
            type="button"
            className="brand-multi-trigger"
            aria-expanded={brandMenuOpen}
            aria-haspopup="listbox"
            onClick={() => setBrandMenuOpen((open) => !open)}
          >
            <span className="brand-multi-trigger-text">{brandTriggerLabel}</span>
            <span className="brand-multi-chevron" aria-hidden="true">
              ▼
            </span>
          </button>
          {brandMenuOpen ? (
            <div className="brand-multi-panel" role="listbox" aria-multiselectable="true">
              {brands.map((brand) => (
                <label key={brand} className="brand-multi-option">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="filter-group">
        <p>Minimum Rating</p>
        <select
          className="filter-select"
          value={minRating}
          onChange={(event) => setMinRating(Number(event.target.value))}
        >
          {[0, 3, 3.5, 4, 4.5].map((value) => (
            <option key={value} value={value}>
              {value === 0 ? 'All ratings' : `${value}+ stars`}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <p>
          Price Range: ${minPrice} - ${maxPrice}
        </p>
        <div className="price-range-wrap">
          <label className="price-input-label">
            Min
            <input
              className="price-range-input"
              type="range"
              min={lowestPrice}
              max={highestPrice}
              step="1"
              value={minPrice}
              onChange={(event) => handleMinPriceChange(event.target.value)}
            />
          </label>
          <label className="price-input-label">
            Max
            <input
              className="price-range-input"
              type="range"
              min={lowestPrice}
              max={highestPrice}
              step="1"
              value={maxPrice}
              onChange={(event) => handleMaxPriceChange(event.target.value)}
            />
          </label>
        </div>
      </div>
      <button type="button" className="reset-filters-btn" onClick={resetFilters}>
        Reset Filters
      </button>
    </aside>
  )
}

export default FilterSidebar
