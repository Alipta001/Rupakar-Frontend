import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import FeaturedCollections from '@/components/featured-collections'
import TerracottaShowcase from '@/components/terracotta-showcase'
import ArtisanStory from '@/components/artisan-story'
import BestSellers from '@/components/best-sellers'
import ShopByCategory from '@/components/shop-by-category'
import HeritageSection from '@/components/heritage-section'
import Testimonials from '@/components/testimonials'
import InstagramGallery from '@/components/instagram-gallery'
import Newsletter from '@/components/newsletter'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturedCollections />
      <TerracottaShowcase />
      <ArtisanStory />
      <BestSellers />
      <ShopByCategory />
      <HeritageSection />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
      <Footer />
    </main>
  )
}
