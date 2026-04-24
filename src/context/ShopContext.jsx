import { createContext, useMemo, useState } from 'react'
import { products } from '../data/products'

export const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        selectedCategory === 'All' || product.category === selectedCategory
      const searchMatch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      return categoryMatch && searchMatch
    })
  }, [searchTerm, selectedCategory])

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

  const login = (name, email) => setUser({ name, email })
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
        cart,
        addToCart,
        removeFromCart,
        cartTotal,
        cartCount,
        user,
        login,
        logout,
        clearCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}
