import { useContext } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import FilterSidebar from '../components/FilterSidebar'
import HeroBanner from '../components/HeroBanner'
import ImageCarousel from '../components/ImageCarousel'
import ProductGrid from '../components/ProductGrid'
import { ShopContext } from '../context/ShopContext'

function HomePage() {
  const { searchTerm, setSearchTerm, user } = useContext(ShopContext)
  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Guest'

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
          <p>Name: {fullName}</p>
          <p>Email: {user?.email || 'Not added yet'}</p>
          <p>Status: {user ? 'Logged In' : 'Logged Out'}</p>
          <Link to="/login" className="user-info-link">
            {user ? 'Edit profile' : 'Add profile'}
          </Link>
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
