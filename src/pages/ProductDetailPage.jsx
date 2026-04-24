import { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

function ProductDetailPage() {
  const { id } = useParams()
  const { products, addToCart } = useContext(ShopContext)
  const product = products.find((item) => item.id === Number(id))

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

  return (
    <section className="product-detail-page">
      <article className="product-detail-card">
        <img src={product.image} alt={product.name} />
        <div className="product-detail-content">
          <p className="meta">{product.category}</p>
          <h2>{product.name}</h2>
          <p className="product-rating">Rating: {product.rating} / 5</p>
          <p className="product-price">Rs.{product.price}</p>
          <p className="product-description">
            Premium quality {product.name.toLowerCase()} designed for everyday
            comfort and performance. Fast delivery, secure payment, and easy
            returns available.
          </p>
          <div className="product-detail-actions">
            <button type="button" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
            <Link to="/cart" className="checkout-link">
              Go to Cart
            </Link>
          </div>
        </div>
      </article>
    </section>
  )
}

export default ProductDetailPage
