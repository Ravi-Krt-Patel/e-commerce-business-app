import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

function PaymentPage() {
  const navigate = useNavigate()
  const { cartTotal, cart, clearCart } = useContext(ShopContext)
  const [paid, setPaid] = useState(false)

  const payNow = () => {
    if (!cart.length) return
    clearCart()
    setPaid(true)
    setTimeout(() => navigate('/'), 1800)
  }

  return (
    <section className="panel">
      <h2>Payment</h2>
      {!cart.length && !paid && (
        <p className="empty-state">
          Your cart is empty. <Link to="/">Shop now</Link>
        </p>
      )}

      {cart.length > 0 && !paid && (
        <div className="payment-box">
          <p>Order Value: ${cartTotal.toFixed(2)}</p>
          <button type="button" onClick={payNow}>
            Pay Now
          </button>
        </div>
      )}

      {paid && (
        <p className="success-msg">
          Payment successful! Redirecting you to home page...
        </p>
      )}
    </section>
  )
}

export default PaymentPage
