import { AxiosInstance } from '@/api/axios/axios'

export interface Product {
  id: number | string
  _id?: string
  variantId?: string
  slug: string
  name: string
  craft: string
  region: string
  artisan: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  images: string[]
  badge?: string
  badgeColor?: string
  description: string
  story: string
  dimensions: string
  material: string
  care: string
  category: string
}

const baseFallbackProducts: Product[] = [
  {
    id: 1,
    slug: 'madhubani-terracotta-vase',
    name: 'Madhubani Terracotta Vase',
    craft: 'Bihar Folk Art',
    region: 'Mithila, Bihar',
    artisan: 'Savitri Devi',
    price: 2499,
    originalPrice: 3200,
    rating: 4.9,
    reviews: 128,
    image: '/images/product-vase.jpg',
    images: ['/images/product-vase.jpg', '/images/collection-terracotta.jpg', '/images/gallery-1.jpg'],
    badge: 'Best Seller',
    badgeColor: '#C89B3C',
    description: 'A masterpiece of Madhubani folk art tradition, this hand-thrown terracotta vase is adorned with intricate paintings depicting the mythology of ancient Mithila. Each motif tells a story passed down through generations of women painters.',
    story: 'Savitri Devi learnt Madhubani painting at age seven from her grandmother. Now 54, she has preserved this sacred art form while earning international recognition. Your purchase directly supports her village cooperative in Bihar.',
    dimensions: '28cm H × 14cm D',
    material: '100% natural river clay, mineral pigments',
    care: 'Wipe with dry cloth. Avoid direct sunlight.',
    category: 'terracotta',
  },
  {
    id: 2,
    slug: 'tribal-painted-bowl',
    name: 'Tribal Painted Bowl',
    craft: 'Gondi Art',
    region: 'Bastar, Madhya Pradesh',
    artisan: 'Ramu Tekam',
    price: 1899,
    rating: 4.8,
    reviews: 94,
    image: '/images/product-bowl.jpg',
    images: ['/images/product-bowl.jpg', '/images/gallery-1.jpg', '/images/category-pottery.jpg'],
    badge: 'New Arrival',
    badgeColor: '#6B3E26',
    description: 'Wheel-thrown and hand-painted in the ancient Gondi tradition, this bowl features sacred geometric patterns inspired by the forest deity worship of central India.',
    story: 'Ramu Tekam is a third-generation Gondi artist from Bastar. His work has been featured in the National Crafts Museum, New Delhi.',
    dimensions: '12cm H × 22cm D',
    material: 'Terracotta clay, natural earth pigments',
    care: 'Hand wash gently. Decorative use recommended.',
    category: 'terracotta',
  },
  {
    id: 3,
    slug: 'dancing-figurine',
    name: 'Dancing Figurine',
    craft: 'Rajasthani Craft',
    region: 'Jaipur, Rajasthan',
    artisan: 'Ramkumar Prajapati',
    price: 3499,
    originalPrice: 4500,
    rating: 5.0,
    reviews: 57,
    image: '/images/product-figurine.jpg',
    images: ['/images/product-figurine.jpg', '/images/artisan-portrait.jpg', '/images/gallery-3.jpg'],
    badge: 'Limited Edition',
    badgeColor: '#7A1F1F',
    description: 'A breathtaking hand-sculpted terracotta figurine of a Kathak dancer frozen in mid-pirouette. Every fold of the ghagra, every mudra of the fingers is rendered with astonishing precision.',
    story: 'Ramkumar is a sixth-generation potter whose family has served the royal courts of Rajasthan. Only 12 of these figurines were created in 2024.',
    dimensions: '32cm H × 14cm W',
    material: 'Premium Jaipur clay, gold leaf accents',
    care: 'Dust with soft brush. Handle with care.',
    category: 'folk-art',
  },
  {
    id: 4,
    slug: 'hand-carved-diya-lamp',
    name: 'Hand-Carved Diya Lamp',
    craft: 'UP Pottery',
    region: 'Khurja, Uttar Pradesh',
    artisan: 'Mohanlal Kumhar',
    price: 999,
    rating: 4.7,
    reviews: 213,
    image: '/images/product-lamp.jpg',
    images: ['/images/product-lamp.jpg', '/images/gallery-3.jpg', '/images/collection-decor.jpg'],
    badge: 'Best Seller',
    badgeColor: '#C89B3C',
    description: 'A beautifully carved terracotta oil lamp with intricate lattice work that casts dancing shadow patterns when lit. Functional sacred art for your home altar or table.',
    story: 'Mohanlal has been crafting diyas since childhood in Khurja, India\'s pottery capital. His workshop employs 14 village women.',
    dimensions: '8cm H × 12cm W',
    material: 'Khurja terracotta clay',
    care: 'Suitable for oil and wax candles.',
    category: 'decor',
  },
  {
    id: 5,
    slug: 'patchitra-wall-plate',
    name: 'Pattachitra Wall Plate',
    craft: 'Odisha Tradition',
    region: 'Puri, Odisha',
    artisan: 'Ananta Mohanty',
    price: 2199,
    originalPrice: 2800,
    rating: 4.9,
    reviews: 76,
    image: '/images/product-plate.jpg',
    images: ['/images/product-plate.jpg', '/images/gallery-2.jpg', '/images/category-folk-art.jpg'],
    badge: 'Featured',
    badgeColor: '#6B3E26',
    description: 'A large terracotta wall plate hand-painted in the Pattachitra tradition of Odisha, depicting the mythological Dashavatara — the ten avatars of Lord Vishnu — in exquisite detail.',
    story: 'Ananta comes from Raghurajpur, India\'s only heritage craft village where every household is an artist\'s studio.',
    dimensions: '35cm D',
    material: 'Terracotta, natural stone colors, lacquer finish',
    care: 'Wall mounting only. Do not expose to moisture.',
    category: 'folk-art',
  },
]

export const fallbackProducts: Product[] = baseFallbackProducts

const normalizeImage = (value: string | { url?: string; src?: string } | null | undefined) => {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') return value.url ?? value.src ?? '/images/product-vase.jpg'
  return '/images/product-vase.jpg'
}

const normalizeProduct = (item: any): Product => {
  const images = Array.isArray(item?.images) ? item.images.map(normalizeImage) : []
  const primaryImage = normalizeImage(item?.image ?? item?.primaryImage ?? item?.thumbnail ?? images[0])
  const price = Number(item?.price ?? item?.variants?.[0]?.price ?? 0)
  const rawId = item?._id ?? item?.id ?? item?.productId
  const id = typeof rawId === 'number' ? rawId : String(rawId ?? '')
  const primaryVariant = Array.isArray(item?.variants) ? item.variants[0] : null
  const variantId = item?.variantId ?? primaryVariant?._id ?? primaryVariant?.id ?? (typeof primaryVariant === 'string' ? primaryVariant : id)

  return {
    id: id || 0,
    _id: typeof rawId === 'string' ? rawId : undefined,
    variantId: variantId ? String(variantId) : undefined,
    slug: String(item?.slug ?? item?.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ?? 'product'),
    name: String(item?.name ?? 'Handcrafted Product'),
    craft: String(item?.craft ?? item?.category ?? 'Handcrafted'),
    region: String(item?.region ?? 'India'),
    artisan: String(item?.artisan ?? item?.vendorName ?? 'Rupakar Artisan'),
    price: Number.isFinite(price) ? price : 0,
    originalPrice: item?.originalPrice ?? item?.compareAtPrice ?? undefined,
    rating: Number(item?.rating ?? 4.8),
    reviews: Number(item?.reviews ?? 0),
    image: primaryImage,
    images: images.length ? images : [primaryImage],
    badge: item?.badge ?? undefined,
    badgeColor: item?.badgeColor ?? '#C89B3C',
    description: String(item?.description ?? item?.shortDescription ?? 'Handcrafted artisan product from India.'),
    story: String(item?.story ?? item?.description ?? 'Crafted with tradition and care.'),
    dimensions: String(item?.dimensions ?? 'Crafted with care.'),
    material: String(item?.material ?? 'Natural materials'),
    care: String(item?.care ?? 'Handle with care.'),
    category: String(item?.category ?? 'terracotta'),
  }
}

export async function fetchProducts(params: Record<string, any> = {}) {
  try {
    const response = await AxiosInstance.get('/products', { params })
    const payload = response.data?.data ?? response.data ?? {}
    const list = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
    return list.map(normalizeProduct)
  } catch (error) {
    return fallbackProducts
  }
}

export async function fetchProductBySlug(slug: string) {
  try {
    const response = await AxiosInstance.get(`/products/${slug}`)
    const payload = response.data?.data ?? response.data ?? null
    return payload ? normalizeProduct(payload) : undefined
  } catch (error) {
    return fallbackProducts.find((product) => product.slug === slug) ?? fallbackProducts[0]
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  return fallbackProducts.find((product) => product.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return fallbackProducts.filter((product) => product.category === category)
}
