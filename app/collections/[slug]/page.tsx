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
import { ProductCard } from '@/components/product-card'

const collectionProfiles: Record<string, { name: string; image: string; intro: string; detail: string }> = {
  terracotta: {
    name: 'Terracotta',
    image: '/images/collection-terracotta.jpg',
    intro: 'Earth, fire, and the quiet beauty of a hand-shaped form.',
    detail: 'A study in warm clay, time-worn textures, and the artisans who turn the soil beneath us into objects made to last.',
  },
  'folk-art': {
    name: 'Folk Art',
    image: '/images/category-folk-art.jpg',
    intro: 'Stories carried in line and pigment across generations.',
    detail: 'Intricate visual storytelling honoring tribal traditions, mythological folklores, and generational canvas art.',
  },
  'folk-arts': {
    name: 'Folk Arts',
    image: '/images/category-folk-art.jpg',
    intro: 'Stories carried in line and pigment across generations.',
    detail: 'Intricate visual storytelling honoring tribal traditions, mythological folklores, and generational canvas art.',
  },
  folkart: {
    name: 'Folk Art',
    image: '/images/category-folk-art.jpg',
    intro: 'Stories carried in line and pigment across generations.',
    detail: 'Intricate visual storytelling honoring tribal traditions, mythological folklores, and generational canvas art.',
  },
  'home-decor': {
    name: 'Home Decor',
    image: '/images/collection-decor.jpg',
    intro: 'Objects with a sense of place.',
    detail: 'Thoughtful accents that bring the language of Indian craft into the everyday spaces around you.',
  },
  decor: {
    name: 'Home Decor',
    image: '/images/collection-decor.jpg',
    intro: 'Objects with a sense of place.',
    detail: 'Thoughtful accents that bring the language of Indian craft into the everyday spaces around you.',
  },
  'dokra-craft': {
    name: 'Dokra Craft',
    image: '/images/category-pottery.jpg',
    intro: 'Four thousand years of lost-wax metallurgy, cast in timeless brass and bronze.',
    detail: 'Ancient non-ferrous metal casting practiced by indigenous artisans, transforming raw metal into sacred and aesthetic forms.',
  },
  dokra: {
    name: 'Dokra Craft',
    image: '/images/category-pottery.jpg',
    intro: 'Four thousand years of lost-wax metallurgy, cast in timeless brass and bronze.',
    detail: 'Ancient non-ferrous metal casting practiced by indigenous artisans, transforming raw metal into sacred and aesthetic forms.',
  },
  textiles: {
    name: 'Textiles',
    image: '/images/gallery-3.jpg',
    intro: 'The rhythm of the handloom woven into Bengal cotton and silk.',
    detail: 'Spun, dyed, and woven on traditional pit and frame looms by master weavers committed to slow fashion.',
  },
  'jute-crafts': {
    name: 'Jute Crafts',
    image: '/images/gallery-2.jpg',
    intro: 'Natural golden fibers shaped into purposeful, sustainable craft.',
    detail: 'Eco-conscious craftsmanship turning humble plant fibers into textured, elegant decor and lifestyle essentials.',
  },
  jute: {
    name: 'Jute Crafts',
    image: '/images/gallery-2.jpg',
    intro: 'Natural golden fibers shaped into purposeful, sustainable craft.',
    detail: 'Eco-conscious craftsmanship turning humble plant fibers into textured, elegant decor and lifestyle essentials.',
  },
  jewelry: {
    name: 'Artisan Jewelry',
    image: '/images/gallery-1.jpg',
    intro: 'Handcrafted adornments celebrating indigenous metals, terracotta beads, and heritage motifs.',
    detail: 'Timeless wearable craft shaped by generational metalsmiths and clay artisans.',
  },
  jewellery: {
    name: 'Artisan Jewelry',
    image: '/images/gallery-1.jpg',
    intro: 'Handcrafted adornments celebrating indigenous metals, terracotta beads, and heritage motifs.',
    detail: 'Timeless wearable craft shaped by generational metalsmiths and clay artisans.',
  },
  pottery: {
    name: 'Studio Pottery',
    image: '/images/category-pottery.jpg',
    intro: 'Wheel-thrown and hand-glazed functional stoneware rooted in natural clays.',
    detail: 'Tactile everyday objects crafted by skilled studio potters using local clays and organic glazes.',
  },
}

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const normalizedSlug = slug.toLowerCase()

  const category = useQuery({
    queryKey: ['category', slug],
    queryFn: async ({ signal }) => (await AxiosInstance.get(`/categories/${encodeURIComponent(slug)}`, { signal })).data?.data,
    retry: false,
  })

  const matchedProfile = collectionProfiles[normalizedSlug]
  const formattedSlugName = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const profile = {
    name: category.data?.name ?? matchedProfile?.name ?? formattedSlugName,
    image: category.data?.image || matchedProfile?.image || '/images/collection-terracotta.jpg',
    intro: matchedProfile?.intro || category.data?.description || 'A considered edit of Indian craft.',
    detail: matchedProfile?.detail || category.data?.description || 'Discover pieces shaped by material, memory, and the hands that made them.',
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
      <Navbar position="sticky" />

      {/* Collection Hero Banner - Starts cleanly below navbar */}
      <section className="relative isolate min-h-[460px] sm:min-h-[500px] md:min-h-[540px] overflow-hidden bg-[#1E1511] flex items-center">
        <Image
          src={profile.image}
          alt={profile.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-65 scale-[1.02] transition-transform duration-1000"
        />
        {/* Cinematic rich dark gradient overlays for maximum readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#140F0D]/95 via-[#140F0D]/80 to-[#140F0D]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#140F0D] via-transparent to-black/30" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 py-14 sm:py-16 md:py-20 md:px-12">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#D8B15A]/80">
            <Link href="/" className="hover:text-[#F8F4EE] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-[#F8F4EE] transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-[#F8F4EE]">{profile.name}</span>
          </nav>

          <div className="max-w-2xl text-[#F8F4EE]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D8B15A]/30 bg-[#1E1511]/60 px-3.5 py-1 text-[10px] font-sans uppercase tracking-[0.3em] text-[#D8B15A] backdrop-blur-sm">
              <Sparkles size={12} className="text-[#D8B15A]" />
              <span>Curated Collection</span>
            </div>
            <h1
              className="mb-4 text-4xl font-light leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              {profile.name}
            </h1>
            <p
              className="max-w-lg text-base sm:text-lg leading-relaxed text-[#F8F4EE]/90"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              {profile.intro}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 sm:gap-10 px-4 sm:px-6 py-12 sm:py-16 md:grid-cols-[1fr_2fr] md:px-12 md:py-24">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C89B3C]">The edit</p>
          <h2 className="mt-4 text-3xl sm:text-4xl leading-none md:text-5xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{profile.intro}</h2>
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

      <section className="border-t border-[#D4C4B0]/70 bg-[#EFE3D3]/45 px-4 sm:px-6 py-12 sm:py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C89B3C]">From the studio</p>
              <h2 className="mt-2 text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>Pieces with a pulse</h2>
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
              {productItems.map((product: any, idx: number) => (
                <ProductCard
                  key={product.id ?? product._id ?? product.slug ?? idx}
                  product={product}
                  priority={idx < 4}
                />
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
