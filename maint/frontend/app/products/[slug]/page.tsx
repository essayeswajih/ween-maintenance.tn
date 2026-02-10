import { Metadata } from 'next'
import ProductContent from './ProductContent'
import { Product } from '@/lib/types'

// Server-side fetching helper
// Uses Docker service URL if available
const BACKEND_URL = process.env.SERVER_API_URL || 'http://backend:8005';

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/vetrine/products/slug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch product ${slug}:`, error);
    return null;
  }
}

// Generate Dynamic Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Produit non trouvé',
      description: 'Ce produit n\'existe pas'
    }
  }

  const title = product.name;
  const description = product.description?.substring(0, 160) || `Découvrez ${product.name} chez Ween Maintenance.`;
  const images = product.image_url ? [product.image_url] : [];

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title: `${title} - Ween Maintenance`,
      description,
      type: 'website',
      images
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: `${description} – Prix: ${
        product.discounted_price || product.price
      } TND`,
      images,
    }
  }
}

// Server Component
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return <ProductContent product={null} />
  }

  // JSON-LD for Product
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image_url ? [product.image_url] : [],
    description: product.description,
    sku: product.sku || product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Ween Maintenance'
    },
    offers: {
      '@type': 'Offer',
      url: `https://ween-maintenance.tn/products/${slug}`,
      priceCurrency: 'TND',
      price: product.discounted_price || product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 days
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Ween Maintenance'
      }
    },
    aggregateRating: product.rating && (product.num_ratings || 100) > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.num_ratings
    } : undefined
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductContent product={product} />
    </>
  )
}
