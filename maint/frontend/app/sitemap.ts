import { MetadataRoute } from 'next'

const BACKEND_URL = process.env.SERVER_API_URL || 'http://backend:8005'

async function getBlogPosts() {
  try {
    const res = await fetch(`${BACKEND_URL}/blogs`, {
      next: { revalidate: 360 },
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error('Failed to fetch blogs for sitemap:', error)
    return []
  }
}

async function getProducts() {
  try {
    const res = await fetch(
      `${BACKEND_URL}/vetrine/products?limit=1000`,
      { next: { revalidate: 360 } }
    )
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error)
    return []
  }
}

async function getServices() {
  try {
    const res = await fetch(`${BACKEND_URL}/service`, {
      next: { revalidate: 360 },
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error('Failed to fetch services for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ween-maintenance.tn'

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    '',
    '/products',
    '/services',
    '/services/request',
    '/blogs',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))

  const [posts, products, services] = await Promise.all([
    getBlogPosts(),
    getProducts(),
    getServices(),
  ])

  // Blog routes (keep lastModified if you want)
  const blogRoutes: MetadataRoute.Sitemap = Array.isArray(posts)
    ? posts.map((post: any) => ({
        url: `${baseUrl}/blogs/${post.slug}`,
        lastModified: post.created_at
          ? new Date(post.created_at)
          : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }))
    : []

  // Product routes (NO lastModified)
  const productRoutes: MetadataRoute.Sitemap = Array.isArray(products)
    ? products.map((product: any) => ({
        url: `${baseUrl}/products/${product.slug}`,
        changeFrequency: 'weekly',
        priority: 0.7,
      }))
    : []

  // Service routes (NO lastModified)
  const serviceRoutes: MetadataRoute.Sitemap = Array.isArray(services)
    ? services.map((service: any) => ({
        url: `${baseUrl}/services/${service.slug}`,
        changeFrequency: 'monthly',
        priority: 0.7,
      }))
    : []

  return [
    ...routes,
    ...blogRoutes,
    ...productRoutes,
    ...serviceRoutes,
  ]
}
