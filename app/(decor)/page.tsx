import { HomeContent } from '@/components/decor/HomeContent'
import { fetchJson } from '@/lib/server-api'
import type { HeroCarouselSlide } from '@/components/decor/HeroCarousel'

// ISR: statically prerender the homepage and regenerate from the backend at most
// once per day. Lower this value to make product changes appear sooner.
export const revalidate = 86400

const FALLBACK_SLIDES: HeroCarouselSlide[] = [
  {
    id: 'curtains',
    imageSrc: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=2400',
    imageAlt: 'Luxury interiors with warm tones',
    eyebrow: 'New Season • Premium Décor',
    title: 'Elevate Every Room',
    subtitle: 'Curated home décor designed for modern, elegant living.',
    ctaLabel: 'Explore Collection',
    href: '/products',
    desktopAlign: 'left',
  },
  {
    id: 'textiles',
    imageSrc: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=2400',
    imageAlt: 'Minimal living room décor',
    eyebrow: 'Textures • Neutrals • Layers',
    title: 'Soft Textiles, Bold Impact',
    subtitle: 'Refresh your space with premium fabrics and timeless patterns.',
    ctaLabel: 'Shop Textiles',
    href: '/products?category=curtains',
    desktopAlign: 'left',
  },
  {
    id: 'motorized-blinds',
    imageSrc: 'https://images.unsplash.com/photo-1609423433459-a65b330ef5da?w=2400',
    imageAlt: 'Striped window blinds casting shadows in a bright room',
    eyebrow: 'Smart Living • Motorized Blinds',
    title: 'Effortless Light Control',
    subtitle: 'Automate your windows with motorized blinds for comfort and style at the touch of a button.',
    ctaLabel: 'Shop Motorized Blinds',
    href: '/products?category=Motorized Blinds',
    desktopAlign: 'left',
  },
]

const FALLBACK_CATEGORIES = [
  { label: 'Furniture', href: '/products?category=Furniture', imageSrc: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', imageAlt: 'Luxury furniture collection' },
  { label: 'Accessories', href: '/products?category=Accessories', imageSrc: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', imageAlt: 'Home accessories and decor' },
  { label: 'Textiles', href: '/products?category=Textiles', imageSrc: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800', imageAlt: 'Premium textiles and fabrics' },
  { label: 'Lighting', href: '/products?category=Lighting', imageSrc: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800', imageAlt: 'Modern lighting fixtures' },
]

type ApiList<T> = { data?: T[] }
type PageData = { data?: { heroSlides?: HeroCarouselSlide[] } }

export default async function HomePage() {
  // Fetch all home data on the server. Each call falls back independently so one
  // failing endpoint never breaks the render.
  const [pageData, catsData, bestData, newData] = await Promise.all([
    fetchJson<PageData>('/api/v1/pages/home', {}, revalidate),
    fetchJson<ApiList<any>>('/api/v1/categories', { data: [] }, revalidate),
    fetchJson<ApiList<any>>('/api/v1/products?bestseller=true', { data: [] }, revalidate),
    fetchJson<ApiList<any>>('/api/v1/products?newArrival=true', { data: [] }, revalidate),
  ])

  const heroSlides = pageData?.data?.heroSlides?.length ? pageData.data.heroSlides : FALLBACK_SLIDES
  const categories = catsData?.data?.length ? catsData.data : FALLBACK_CATEGORIES
  const bestsellers = (bestData?.data ?? []).slice(0, 4)
  const newArrivals = (newData?.data ?? []).slice(0, 4)

  return (
    <HomeContent
      heroSlides={heroSlides}
      categories={categories}
      bestsellers={bestsellers}
      newArrivals={newArrivals}
    />
  )
}
