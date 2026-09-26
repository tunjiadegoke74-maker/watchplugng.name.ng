import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, X } from 'lucide-react'
export const Route = createFileRoute('/checkout/cancel')({ component: CheckoutCancel })
function CheckoutCancel() {
  return <main className="checkout-page"><section className="checkout-card"><div className="checkout-icon"><X /></div><p className="eyebrow">Checkout paused</p><h1>No charge made.</h1><p>Your payment was cancelled and your card was not charged. The collection is still here whenever you’re ready.</p><Link to="/" className="nav-pill"><ArrowLeft size={16} /> Return to the edit</Link></section></main>
}
