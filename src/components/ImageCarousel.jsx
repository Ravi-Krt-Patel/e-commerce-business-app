import { useEffect, useState } from 'react'
import { heroBanners } from '../data/products'

function ImageCarousel() {
  const [current, setCurrent] = useState(0)

  const previous = () =>
    setCurrent((value) => (value === 0 ? heroBanners.length - 1 : value - 1))
  const next = () =>
    setCurrent((value) => (value === heroBanners.length - 1 ? 0 : value + 1))

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((value) => (value === heroBanners.length - 1 ? 0 : value + 1))
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="carousel">
      <img src={heroBanners[current].image} alt={heroBanners[current].title} />
      <div className="carousel-content">
        <h3>{heroBanners[current].title}</h3>
        <p>{heroBanners[current].subtitle}</p>
      </div>
      <button type="button" className="carousel-btn left" onClick={previous}>
        {'<'}
      </button>
      <button type="button" className="carousel-btn right" onClick={next}>
        {'>'}
      </button>
    </section>
  )
}

export default ImageCarousel
