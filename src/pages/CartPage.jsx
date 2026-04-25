import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

function CartPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cart, addToCart, removeFromCart, cartTotal, user } = useContext(ShopContext)
  const [couponCode, setCouponCode] = useState('')
  const deliveryName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Add profile'
  const deliveryAddress = user?.address
    ? `${user.address.line1}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}`
    : 'Please add your delivery address'

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true, state: { from: location.pathname } })
    }
  }, [location.pathname, navigate, user])

  const subtotal = cartTotal
  const shippingCharge = subtotal > 0 ? 99 : 0
  const discount = useMemo(() => {
    const normalizedCode = couponCode.trim().toUpperCase()
    if (normalizedCode === 'SAVE10') {
      return subtotal * 0.1
    }
    if (normalizedCode === 'FLAT200' && subtotal >= 1500) {
      return 200
    }
    return 0
  }, [couponCode, subtotal])
  const totalAmount = Math.max(subtotal + shippingCharge - discount, 0)

  return (
    <section className="cart-layout">
      {!cart.length ? (
        <div className="panel">
          <h2>Cart / Basket</h2>
          <p className="empty-state">
            No items in cart. <Link to="/">Continue shopping</Link>
          </p>
        </div>
      ) : (
        <>
          <div className="cart-main">
            <article className="cart-address">
              <div>
                <p className="muted-label">Deliver to</p>
                <strong>{deliveryName}</strong>
                <p className="address-text">{deliveryAddress}</p>
              </div>
              <Link to="/login" className="checkout-link address-change-btn">
                Change
              </Link>
            </article>

            <article className="coupon-box">
              <h3>Coupons & Discounts</h3>
              <div className="coupon-row">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="Use SAVE10 or FLAT200"
                />
              </div>
              <p className="coupon-help">
                SAVE10 = 10% off, FLAT200 = Rs.200 off above Rs.1500
              </p>
            </article>

            <div className="cart-list">
              {cart.map((item) => (
                <article key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>Rs.{item.price}</p>
                  </div>
                  <div className="qty-controls">
                    <button type="button" onClick={() => removeFromCart(item.id)}>
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => addToCart(item)}>
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="price-details-card">
            <h3>Price Details</h3>
            <div className="price-row">
              <span>
                Price ({cart.length} item{cart.length > 1 ? 's' : ''})
              </span>
              <span>Rs.{subtotal.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Shipping Charge</span>
              <span>Rs.{shippingCharge.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Discount</span>
              <span>- Rs.{discount.toFixed(2)}</span>
            </div>
            <div className="price-total">
              <strong>Total Amount</strong>
              <strong>Rs.{totalAmount.toFixed(2)}</strong>
            </div>

            <Link to="/payment" className="checkout-link place-order">
              Place Order
            </Link>
          </aside>
        </>
      )}
    </section>
  )
}

export default CartPage
