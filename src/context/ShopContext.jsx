import { createContext, useMemo, useState } from 'react'
import { products } from '../data/products'

export const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [minRating, setMinRating] = useState(0)
  const [minPrice, setMinPrice] = useState(
    Math.min(...products.map((product) => product.price)),
  )
  const [maxPrice, setMaxPrice] = useState(
    Math.max(...products.map((product) => product.price)),
  )
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)
  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand).filter(Boolean))],
    [],
  )
  const lowestPrice = useMemo(
    () => Math.min(...products.map((product) => product.price)),
    [],
  )
  const highestPrice = useMemo(
    () => Math.max(...products.map((product) => product.price)),
    [],
  )

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        selectedCategory === 'All' || product.category === selectedCategory
      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand)
      const searchMatch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const ratingMatch = product.rating >= minRating
      const priceMatch = product.price >= minPrice && product.price <= maxPrice
      return categoryMatch && brandMatch && searchMatch && ratingMatch && priceMatch
    })
  }, [searchTerm, selectedCategory, selectedBrands, minRating, minPrice, maxPrice])

  const resetFilters = () => {
    setSelectedCategory('All')
    setSelectedBrands([])
    setMinRating(0)
    setMinPrice(lowestPrice)
    setMaxPrice(highestPrice)
  }

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        )
      }
      return [...current, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId ? { ...item, qty: item.qty - 1 } : item,
        )
        .filter((item) => item.qty > 0),
    )
  }

  const login = (profile) => setUser(profile)
  const updateUser = (profile) => setUser(profile)
  const logout = () => setUser(null)
  const clearCart = () => setCart([])

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cart],
  )
  const cartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.qty, 0),
    [cart],
  )

  return (
    <ShopContext.Provider
      value={{
        products,
        filteredProducts,
        searchTerm,
        setSearchTerm,
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
        cart,
        addToCart,
        removeFromCart,
        cartTotal,
        cartCount,
        user,
        login,
        updateUser,
        logout,
        clearCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}
