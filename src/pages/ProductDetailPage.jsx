import { useContext, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StarRating from '../components/StarRating'
import { ShopContext } from '../context/ShopContext'

function ProductDetailPage() {
  const { id } = useParams()
  const { products, addToCart } = useContext(ShopContext)
  const product = products.find((item) => item.id === Number(id))
  const galleryImages = useMemo(
    () => (product?.images?.length ? product.images : [product?.image].filter(Boolean)),
    [product],
  )
  const [activeImage, setActiveImage] = useState(0)

  if (!product) {
    return (
      <section className="panel">
        <h2>Product not found</h2>
        <p className="empty-state">
          This product does not exist. <Link to="/">Go back to home</Link>
        </p>
      </section>
    )
  }

  const sellingPrice = product.price
  const mrp = product.originalPrice || Math.round(product.price * 1.3)
  const discountPercent = Math.max(0, Math.round(((mrp - sellingPrice) / mrp) * 100))
  const primaryImage = galleryImages[activeImage] || product.image

  return (
    <section className="product-detail-page">
      <article className="product-detail-card">
        <div className="product-gallery-column">
          <img className="main-product-image" src={primaryImage} alt={product.name} />
          <div className="thumb-row">
            {galleryImages.map((image, index) => (
              <button
                key={image}
                type="button"
                className={`thumb-btn ${activeImage === index ? 'active' : ''}`}
                onClick={() => setActiveImage(index)}
              >
                <img src={image} alt={`${product.name} view ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="product-detail-content">
          <h2>{product.name}</h2>
          <p className="meta">
            Brand: <strong>{product.brand || 'Generic'}</strong> | Category: {product.category}
          </p>
          <StarRating rating={product.rating} />
          <div className="price-line">
            <span className="discount">-{discountPercent}%</span>
            <p className="product-price">Rs.{sellingPrice}</p>
            <span className="mrp">M.R.P: Rs.{mrp}</span>
          </div>
          <p className="product-description">
            Premium quality {product.name.toLowerCase()} designed for everyday
            comfort and performance. Fast delivery, secure payment, and easy
            returns available.
          </p>
          <div className="offer-strip">
            <span>Cashback offers</span>
            <span>Bank discounts</span>
            <span>Secure transactions</span>
          </div>
          <div className="product-detail-actions">
            <button type="button" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
            <Link to="/cart" className="checkout-link">
              Go to Cart
            </Link>
          </div>
        </div>
        <aside className="buy-box">
          <p className="buy-price">Rs.{sellingPrice}</p>
          <p className="delivery-msg">Free delivery by tomorrow</p>
          <p className="stock-msg">In stock</p>
          <button type="button" className="buy-box-btn" onClick={() => addToCart(product)}>
            Add to cart
          </button>
          <Link to="/cart" className="checkout-link buy-now-link">
            Buy now
          </Link>
        </aside>
      </article>
    </section>
  )
}

export default ProductDetailPage
