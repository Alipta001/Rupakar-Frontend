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
import LandingMusicControl from '@/components/landing-music-control'
import { LandingScrollRestore } from '@/components/landing-scroll-restore'

export default function Home() {
  return (
    <main>
      <LandingScrollRestore />
      <Navbar />
      <div id="hero"><Hero /></div>
      <div id="featured-collections"><FeaturedCollections /></div>
      <div id="terracotta-showcase"><TerracottaShowcase /></div>
      <div id="artisan-story"><ArtisanStory /></div>
      <div id="best-sellers"><BestSellers /></div>
      <div id="shop-by-category"><ShopByCategory /></div>
      <div id="heritage-section"><HeritageSection /></div>
      <div id="testimonials"><Testimonials /></div>
      <div id="instagram-gallery"><InstagramGallery /></div>
      <div id="newsletter"><Newsletter /></div>
      <Footer />
      <LandingMusicControl />
    </main>
  )
}
