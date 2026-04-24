import { useContext } from 'react'
import Footer from '../components/Footer'
import FilterSidebar from '../components/FilterSidebar'
import HeroBanner from '../components/HeroBanner'
import ImageCarousel from '../components/ImageCarousel'
import ProductGrid from '../components/ProductGrid'
import { ShopContext } from '../context/ShopContext'

function HomePage() {
  const { searchTerm, setSearchTerm, user } = useContext(ShopContext)

  return (
    <>
      <HeroBanner />
      <ImageCarousel />

      <section className="landing-topbar">
        <div>
          <h1>Find Your Next Favorite Product</h1>
          <p>Browse categories, filter fast, and add products to your basket.</p>
        </div>
        <div className="user-info-card">
          <h3>User Info</h3>
          <p>Name: {user?.name || 'Guest'}</p>
          <p>Status: {user ? 'Logged In' : 'Logged Out'}</p>
        </div>
      </section>

      <div className="search-bar-wrap">
        <input
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <section className="content-layout">
        <FilterSidebar />
        <ProductGrid />
      </section>

      <Footer />
    </>
  )
}

export default HomePage
