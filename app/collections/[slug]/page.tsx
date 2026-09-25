'use client'

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from '@/api/axios/axios'
import { fetchProducts } from '@/lib/products-api'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ProductGridSkeleton, ErrorState } from '@/components/skeletons'

const collectionProfiles: Record<string, { name: string; image: string; intro: string; detail: string }> = {
  terracotta: {
    name: 'Terracotta',
    image: '/images/collection-terracotta.jpg',
    intro: 'Earth, fire, and the quiet beauty of a hand-shaped form.',
    detail: 'A study in warm clay, time-worn textures, and the artisans who turn the soil beneath us into objects made to last.',
  },
  decor: {
    name: 'Home Decor',
    image: '/images/collection-decor.jpg',
    intro: 'Objects with a sense of place.',
    detail: 'Thoughtful accents that bring the language of Indian craft into the everyday spaces around you.',
  },
}

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const category = useQuery({
    queryKey: ['category', slug],
    queryFn: async ({ signal }) => (await AxiosInstance.get(`/categories/${encodeURIComponent(slug)}`, { signal })).data?.data,
    retry: false,
  })

  const profile = collectionProfiles[slug.toLowerCase()] ?? {
    name: category.data?.name ?? slug.replaceAll('-', ' '),
    image: '/images/collection-terracotta.jpg',
    intro: 'A considered edit of Indian craft.',
    detail: 'Discover pieces shaped by material, memory, and the hands that made them.',
  }

  const {
    data: productItems = [],
    isLoading,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['collection-products', slug],
    queryFn: ({ signal }) => fetchProducts({ category: slug, limit: 24 }, { signal }),
    retry: false,
    staleTime: 60 * 1000,
  })

  const isInitialLoading = isPending || (isLoading && productItems.length === 0)

  return (
    <main className="bg-[#F8F4EE] text-[#1E1A17]">
      <Navbar />
      <section className="relative isolate min-h-[560px] overflow-hidden bg-[#241914]">
        <Image src={profile.image} alt={profile.name} fill priority className="object-cover object-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1511]/90 via-[#1E1511]/55 to-transparent" />
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-end px-6 pb-20 pt-32 md:px-12">
          <div className="max-w-2xl text-[#F8F4EE]">
            <p className="mb-5 flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.35em] text-[#D8B15A]"><Sparkles size={13} /> Collection</p>
            <h1 className="mb-5 text-6xl font-light leading-[0.9] md:text-8xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{profile.name}</h1>
            <p className="max-w-md text-lg leading-relaxed text-[#F8F4EE]/85" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{profile.intro}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1fr_2fr] md:px-12 md:py-24">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C89B3C]">The edit</p>
          <h2 className="mt-4 text-4xl leading-none md:text-5xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{profile.intro}</h2>
        </div>
        <div className="max-w-xl md:ml-auto">
          <p className="text-sm leading-7 text-[#5B4B3F]">{profile.detail}</p>
          <div className="mt-8 h-px w-full bg-[#D4C4B0]" />
          <div className="mt-5 flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.2em] text-[#6B3E26]">
            <span>
              {isInitialLoading
                ? 'Loading collection pieces…'
                : isFetching
                ? `Updating… (${productItems.length} pieces)`
                : productItems.length
                ? `${productItems.length} pieces`
                : 'A new edit is arriving'}
            </span>
            <Link href="/products" className="inline-flex items-center gap-2 text-[#C89B3C] hover:text-[#6B3E26]">Explore all <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[#D4C4B0]/70 bg-[#EFE3D3]/45 px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C89B3C]">From the studio</p>
              <h2 className="mt-2 text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>Pieces with a pulse</h2>
            </div>
            <span className="hidden font-sans text-[10px] uppercase tracking-[0.2em] text-[#5B4B3F] md:block">
              {isInitialLoading
                ? 'Checking inventory…'
                : `${productItems.length} available pieces`}
            </span>
          </div>

          {isInitialLoading ? (
            <ProductGridSkeleton count={8} />
          ) : isError && productItems.length === 0 ? (
            <ErrorState error={error} onRetry={() => refetch()} isRetrying={isFetching} className="py-16" />
          ) : productItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {productItems.map((product: any) => (
                <Link key={product.id ?? product._id ?? product.slug} href={`/products/${product.slug ?? product.id}`} className="group">
                  <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-[#D4C4B0]">
                    <Image src={product.image ?? profile.image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#C89B3C]">{product.craft ?? profile.name}</p>
                  <h3 className="mt-1 text-xl group-hover:text-[#6B3E26]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{product.name}</h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-[#C89B3C]/35 bg-[#F8F4EE] px-6 py-14 text-center md:px-12">
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C89B3C]">The shelves are being prepared</p>
              <h3 className="mt-4 text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>New pieces are on their way.</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5B4B3F]">This collection is still taking shape. Browse the full marketplace while our artisans prepare the next release.</p>
              <Link href="/products" className="mt-7 inline-flex items-center gap-3 bg-[#1E1A17] px-6 py-3 font-sans text-[10px] uppercase tracking-[0.2em] text-[#F8F4EE] transition-colors hover:bg-[#C89B3C] hover:text-[#1E1A17]">Browse all products <ArrowRight size={14} /></Link>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
