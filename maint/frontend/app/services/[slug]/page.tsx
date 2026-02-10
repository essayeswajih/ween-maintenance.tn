import { Metadata } from 'next'
import ServiceContent from './ServiceContent'
import { Service, Rating } from '@/lib/types'

// Server-side fetching helper
// Uses Docker service URL if available
const BACKEND_URL = process.env.SERVER_API_URL || 'http://backend:8005';

async function getService(slug: string): Promise<Service | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/service/slug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch service ${slug}:`, error);
    return null;
  }
}

async function getAllServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/service`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch services list:', error);
    return [];
  }
}

async function getReviews(serviceId: number): Promise<Rating[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/rating/service/${serviceId}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch reviews for service ${serviceId}:`, error);
    return [];
  }
}

// Generate Dynamic Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return {
      title: 'Service non trouvé',
      description: 'Ce service n\'existe pas'
    }
  }

  const title = service.name;
  const description = service.description?.substring(0, 160) || `Découvrez nos services de ${service.name} chez Ween Maintenance.`;
  // Services might define an image, or use defaults
  const images = service.image_url && !service.image_url.startsWith('http') ? [] : (service.image_url ? [service.image_url] : []);

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title: `${title} - Ween Maintenance`,
      description,
      type: 'website',
      images,
      siteName: 'Ween Maintenance'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    }
  }
}

// Server Component
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  const allServices = await getAllServices();

  // If service not found, render UI with null service to handle error state
  if (!service) {
    return <ServiceContent service={null} allServices={allServices} reviews={[]} />
  }

  const reviews = await getReviews(service.id);

  // JSON-LD for Service (ProfessionalService)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: service.name,
    image: service.image_url && service.image_url.startsWith('http') ? [service.image_url] : [],
    description: service.description,
    priceRange: `${service.price} TND`,
    aggregateRating: service.num_ratings > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: service.rating,
      reviewCount: service.num_ratings
    } : undefined,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TN',
      addressLocality: 'Tunis'
    },
    telephone: '+216 27 553 981',
    url: `https://ween-maintenance.tn/services/${slug}`
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceContent service={service} allServices={allServices} reviews={reviews} />
    </>
  )
}
