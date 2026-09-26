import { useEffect, useState } from 'react'
import { ArrowUpRight, LoaderCircle, MessageCircle } from 'lucide-react'
import { createCheckoutSession, getStripeEnabled } from '@/lib/stripe'

export function BuyButton({ productId, productName, compact = false }: { productId: number; productName: string; compact?: boolean }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stripeEnabled, setStripeEnabled] = useState<boolean | null>(null)

  useEffect(() => { getStripeEnabled().then(setStripeEnabled).catch(() => setStripeEnabled(false)) }, [])

  const handleClick = async () => {
    setLoading(true)
    setError('')
    try {
      const url = await createCheckoutSession({ data: productId })
      if (url) window.location.assign(url)
      else throw new Error('No checkout URL')
    } catch {
      setError('Checkout could not start. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={`buy-wrap ${compact ? 'compact' : ''}`}>
      <button className="buy-button" onClick={handleClick} disabled={loading || stripeEnabled !== true} title={stripeEnabled === false ? 'Checkout is being connected' : undefined}>
        {loading ? <><LoaderCircle className="spin" size={16} /> Opening checkout</> : <>{stripeEnabled === false ? 'Coming online' : 'Buy now'} <ArrowUpRight size={16} /></>}
      </button>
      <a
        className="whatsapp-button"
        href={`https://wa.me/2348180506376?text=${encodeURIComponent(`Hi, I'm interested in ${productName}`)}`}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={16} /> Message on WhatsApp
      </a>
      {error && <span className="buy-error" role="alert">{error}</span>}
    </div>
  )
}
