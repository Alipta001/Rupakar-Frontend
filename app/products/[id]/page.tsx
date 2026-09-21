import { notFound } from 'next/navigation'
import { fetchProductBySlug } from '@/lib/products-api'
import { normalizeApiError } from '@/lib/api-errors'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ProductDetail from '@/components/product-detail'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  let product
  try {
    product = await fetchProductBySlug(id)
  } catch (error) {
    if (normalizeApiError(error).status === 404) return {}
    return { title: 'Product — Rupakar' }
  }
  if (!product) return {}
  return {
    title: `${product.name} — Rupakar`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  let product
  try {
    product = await fetchProductBySlug(id)
  } catch (error) {
    if (normalizeApiError(error).status === 404) notFound()
    throw error
  }
  if (!product) notFound()

  return (
    <main>
      <Navbar />
      <ProductDetail product={product} />
      <Footer />
    </main>
  )
}
