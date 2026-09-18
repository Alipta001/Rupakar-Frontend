import { notFound } from 'next/navigation'
import { fallbackProducts, fetchProductBySlug } from '@/lib/products-api'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ProductDetail from '@/components/product-detail'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return fallbackProducts.map((product) => ({ id: String(product.id) }))
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const product = fallbackProducts.find((item) => item.id === Number(id)) ?? fallbackProducts[0]
  if (!product) return {}
  return {
    title: `${product.name} — Rupakar`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = fallbackProducts.find((item) => item.id === Number(id)) ?? (await fetchProductBySlug(id))
  if (!product) notFound()

  return (
    <main>
      <Navbar />
      <ProductDetail product={product} />
      <Footer />
    </main>
  )
}
