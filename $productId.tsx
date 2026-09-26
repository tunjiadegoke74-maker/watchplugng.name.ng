import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import products, { formatNaira } from '@/data/products'
import { BuyButton } from '@/components/BuyButton'

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetail,
  loader: ({ params }) => {
    const product = products.find((item) => item.id === Number(params.productId))
    if (!product) throw new Error('Product not found')
    return product
  },
})

function ProductDetail() {
  const product = Route.useLoaderData()
  return (
    <main className="detail-page">
      <div className="detail-image">
        <img src={product.image} alt={product.name} style={{ objectPosition: product.imagePosition }} />
      </div>
      <section className="detail-panel">
        <Link to="/" className="back-link"><ArrowLeft size={15} /> Back to the edit</Link>
        <p className="detail-category">{product.category} · watchplug.ng</p>
        <h1>{product.name}</h1>
        <p className="detail-description">{product.description}</p>
        <div className="detail-purchase">
          <div><p className="detail-category">One clear price</p><span className="detail-price">{formatNaira(product.price)}</span></div>
          <BuyButton productId={product.id} productName={product.name} />
        </div>
      </section>
    </main>
  )
}
