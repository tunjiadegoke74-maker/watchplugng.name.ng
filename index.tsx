import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowDownRight, ArrowUpRight, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import products, { formatNaira } from '@/data/products'
import { BuyButton } from '@/components/BuyButton'

export const Route = createFileRoute('/')({ component: Storefront })

function Storefront() {
  return (
    <main>
      <header className="site-header">
        <Link to="/" className="wordmark" aria-label="watchplug.ng home">watchplug<span>.ng</span></Link>
        <nav aria-label="Main navigation">
          <a href="#shop">Shop</a>
          <a href="#story">Our eye</a>
          <a className="nav-pill" href="#shop">Browse the edit <ArrowDownRight size={15} /></a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Curated in Nigeria · Available around the clock</p>
          <h1 id="hero-title">The finishing touch,<br /><em>found.</em></h1>
          <p className="hero-deck">Watches, footwear and considered accessories for the way you show up. Distinct pieces, selected with an eye for detail.</p>
          <a className="text-link" href="#shop">Shop the collection <ArrowDownRight size={18} /></a>
        </div>
        <div className="hero-image-wrap">
          <span className="image-note">01 / TIMEPIECES</span>
          <img src="/.netlify/images?url=/img/timepiece.png&w=1100&fm=webp&q=88" alt="Classic leather wrist watch styled on warm linen" />
          <div className="hero-stamp" aria-hidden="true">WP<br /><small>LAGOS</small></div>
        </div>
        <p className="vertical-note">DETAILS MATTER · EST. 2026</p>
      </section>

      <section className="trust-strip" aria-label="Store benefits">
        <span><ShieldCheck size={18} /> Secure checkout</span>
        <span><PackageCheck size={18} /> Carefully selected</span>
        <span><Truck size={18} /> Delivered to your door</span>
      </section>

      <section className="collection" id="shop" aria-labelledby="collection-title">
        <div className="section-heading">
          <div><p className="eyebrow">The complete edit · 07 pieces</p><h2 id="collection-title">Wear it your way.</h2></div>
          <p>From the wrist down, every piece earns its place. Explore our current selection—all at one clear price.</p>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <article className={`product-card card-${index + 1}`} key={product.id}>
              <Link to="/products/$productId" params={{ productId: String(product.id) }} className="product-image">
                <span className="product-number">0{index + 1}</span>
                <img src={product.image} alt={product.name} style={{ objectPosition: product.imagePosition }} loading={index > 2 ? 'lazy' : undefined} />
                <span className="view-cue">View piece <ArrowUpRight size={15} /></span>
              </Link>
              <div className="product-info">
                <div>
                  <p>{product.category}</p>
                  <h3><Link to="/products/$productId" params={{ productId: String(product.id) }}>{product.name}</Link></h3>
                  <span>{product.shortDescription}</span>
                </div>
                <div className="product-action"><strong>{formatNaira(product.price)}</strong><BuyButton productId={product.id} productName={product.name} compact /></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="story" id="story">
        <p className="eyebrow">The watchplug eye</p>
        <blockquote>“Style lives in the details people remember.”</blockquote>
        <p>We bring together expressive essentials that work hard in your wardrobe—pieces with presence, without the fuss.</p>
        <a className="text-link" href="#shop">Find your detail <ArrowUpRight size={18} /></a>
      </section>

      <footer>
        <div className="wordmark footer-mark">watchplug<span>.ng</span></div>
        <p>Watches · Footwear · Accessories</p>
        <p>© 2026 watchplug.ng</p>
      </footer>
    </main>
  )
}
