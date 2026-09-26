import { Link, createFileRoute } from '@tanstack/react-router'
import { Check, ArrowRight } from 'lucide-react'
export const Route = createFileRoute('/checkout/success')({ component: CheckoutSuccess })
function CheckoutSuccess() {
  return <main className="checkout-page"><section className="checkout-card"><div className="checkout-icon"><Check /></div><p className="eyebrow">Order received</p><h1>Good choice.</h1><p>Your payment was successful. We’re preparing your watchplug.ng order and the next update is on its way.</p><Link to="/" className="nav-pill">Keep browsing <ArrowRight size={16} /></Link></section></main>
}
