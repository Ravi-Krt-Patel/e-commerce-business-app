import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { categories } from '../data/products'

function FilterSidebar() {
  const { selectedCategory, setSelectedCategory } = useContext(ShopContext)

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
    </aside>
  )
}

export default FilterSidebar
