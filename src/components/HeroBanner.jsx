import { heroBanners } from '../data/products'

function HeroBanner() {
  return (
    <section className="hero-banner">
      {heroBanners.map((banner) => (
        <article
          key={banner.id}
          className="hero-card"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${banner.image})` }}
        >
          <h2>{banner.title}</h2>
          <p>{banner.subtitle}</p>
        </article>
      ))}
    </section>
  )
}

export default HeroBanner
