import { Link, NavLink } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {
  FaChevronDown,
  FaRegUserCircle,
  FaSearch,
  FaShoppingCart,
} from 'react-icons/fa'
import { BsThreeDotsVertical } from 'react-icons/bs'

function Navbar() {
  const { cartCount, user, logout, searchTerm, setSearchTerm } =
    useContext(ShopContext)

  return (
    <header className="navbar">
      <Link to="/" className="brand-pill">
        <span className="brand-logo">f</span>
        <span>Flipkart</span>
        <FaChevronDown size={11} />
      </Link>

      <div className="navbar-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search for Products, Brands and More"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="navbar-actions">
        <NavLink to="/login" className="nav-action">
          <FaRegUserCircle />
          <span className="nav-label">{user ? user.name : 'Login'}</span>
          <FaChevronDown size={10} />
        </NavLink>

        <span className="nav-action">
          <BsThreeDotsVertical />
          <span className="nav-label">More</span>
          <FaChevronDown size={10} />
        </span>

        <NavLink to="/cart" className="nav-action">
          <FaShoppingCart />
          <span className="nav-label">Cart</span>
          <span className="cart-pill">{cartCount}</span>
        </NavLink>

        {user && (
          <button type="button" onClick={logout} className="logout-btn-inline">
            Logout
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar
