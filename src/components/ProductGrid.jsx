import { useContext, useRef, useState } from 'react'
import { ShopContext } from '../context/ShopContext'

function ProductGrid() {
  const { filteredProducts, addToCart } = useContext(ShopContext)
  const [activeProductId, setActiveProductId] = useState(null)
  const feedbackTimerRef = useRef(null)
  const audioContextRef = useRef(null)
  const lastVibrationAtRef = useRef(0)

  const triggerVibration = () => {
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
      return false
    }

    const now = Date.now()
    if (now - lastVibrationAtRef.current < 120) {
      return false
    }
    lastVibrationAtRef.current = now

    const simple = navigator.vibrate(120)
    if (simple) return true
    return navigator.vibrate([45, 30, 65])
  }

  const playClickFeedback = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass()
    }

    const context = audioContextRef.current
    if (context.state === 'suspended') {
      context.resume()
    }

    const oscillator = context.createOscillator()
    const gainNode = context.createGain()
    oscillator.type = 'triangle'
    oscillator.frequency.value = 160
    gainNode.gain.value = 0.04
    oscillator.connect(gainNode)
    gainNode.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.05)
  }

  const handleAddToCart = (product) => {
    addToCart(product)

    const vibrationTriggered = triggerVibration()

    // Fallback feedback for laptops / unsupported browsers.
    if (!vibrationTriggered) {
      playClickFeedback()
    }

    setActiveProductId(null)
    requestAnimationFrame(() => setActiveProductId(product.id))

    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current)
    }

    feedbackTimerRef.current = setTimeout(() => {
      setActiveProductId(null)
    }, 650)
  }

  if (!filteredProducts.length) {
    return <p className="empty-state">No products found for this filter.</p>
  }

  return (
    <section className="product-grid">
      {filteredProducts.map((product) => (
        <article
          key={product.id}
          className={`product-card ${activeProductId === product.id ? 'added-feedback' : ''}`}
        >
          <img src={product.image} alt={product.name} />
          <h4>{product.name}</h4>
          <p className="meta">{product.category}</p>
          <p className="meta">Rating: {product.rating}</p>
          <div className="card-bottom">
            <strong>${product.price}</strong>
            <button
              type="button"
              onPointerDown={triggerVibration}
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </article>
      ))}
    </section>
  )
}

export default ProductGrid
