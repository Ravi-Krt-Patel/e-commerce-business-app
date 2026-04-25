import { useContext, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

function PaymentPage() {
  const navigate = useNavigate()
  const { cartTotal, cart, clearCart, user } = useContext(ShopContext)
  const [paid, setPaid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const totals = useMemo(() => {
    const subtotal = cartTotal
    const shippingCharge = subtotal > 0 ? 99 : 0
    return {
      subtotal,
      shippingCharge,
      grandTotal: Math.max(subtotal + shippingCharge, 0),
    }
  }, [cartTotal])

  const payNow = async () => {
    try {
      setError('')
      if (!cart.length) return
      setLoading(true)

      const ok = await loadRazorpay()
      if (!ok) {
        setError('Failed to load Razorpay checkout. Please check your connection and try again.')
        return
      }

      // Create order on backend (amount in paise).
      const amountPaise = Math.round(totals.grandTotal * 100)
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountPaise,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
        }),
      })

      if (!orderRes.ok) {
        const body = await orderRes.json().catch(() => ({}))
        throw new Error(body?.error || 'Failed to create order')
      }

      const order = await orderRes.json()

      const customerName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Guest'
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        name: 'Ecommerce Business',
        description: 'Order payment',
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        prefill: {
          name: customerName,
          email: user?.email || '',
          contact: user?.phone || '',
        },
        notes: {
          items: String(cart.length),
        },
        theme: { color: '#2563eb' },
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            })
            const verifyBody = await verifyRes.json().catch(() => ({}))
            if (!verifyRes.ok || !verifyBody.verified) {
              throw new Error('Payment verification failed')
            }
            clearCart()
            setPaid(true)
            setTimeout(() => navigate('/'), 1800)
          } catch (err) {
            setError(err?.message || 'Payment verification failed')
          }
        },
      }

      if (!options.key) {
        setError('Missing VITE_RAZORPAY_KEY_ID. Add it in your frontend .env and restart dev server.')
        return
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (resp) => {
        const msg =
          resp?.error?.description || resp?.error?.reason || 'Payment failed. Please try again.'
        setError(msg)
      })
      rzp.open()
    } catch (err) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
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
          <p>Subtotal: Rs.{totals.subtotal.toFixed(2)}</p>
          <p>Shipping: Rs.{totals.shippingCharge.toFixed(2)}</p>
          <p>
            <strong>Total: Rs.{totals.grandTotal.toFixed(2)}</strong>
          </p>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="button" onClick={payNow} disabled={loading}>
            {loading ? 'Opening Razorpay...' : 'Pay with Razorpay'}
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
