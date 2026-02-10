import { Metadata } from 'next'
import ArticleContent from './ArticleContent'
import { blogArticles } from '@/lib/blog-data'

// Server-side fetching helper
// NOTE: In Next.js Server Components we can use standard fetch
// We need to use the internal docker container URL if running inside docker, 
// OR the public URL if accessible. Since we are building/running in docker mostly, 
// let's try to use the environment variable for server side connectivity.
const BACKEND_URL = process.env.SERVER_API_URL || 'http://backend:8005';

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/blogs/slug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      // Fallback to local data
      const localArticle = blogArticles.find(a => a.slug === slug);
      return localArticle || null;
    }
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch article ${slug} from API, checking local data:`, error);
    const localArticle = blogArticles.find(a => a.slug === slug);
    return localArticle || null;
  }
}

async function getRelatedArticles(category: string, currentSlug: string) {
  try {
    // Try fetch from backend
    const res = await fetch(`${BACKEND_URL}/blogs`, { next: { revalidate: 60 } });
    let blogs = [];
    if (res.ok) {
      blogs = await res.json();
    }

    // If empty result or error, fallback
    if (!Array.isArray(blogs) || blogs.length === 0) {
      blogs = blogArticles;
    }

    if (Array.isArray(blogs)) {
      return blogs
        .filter((a: any) => a.category === category && a.slug !== currentSlug)
        .slice(0, 3);
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch related articles, using fallback:', error);
    // Fallback
    return blogArticles
      .filter((a: any) => a.category === category && a.slug !== currentSlug)
      .slice(0, 3);
  }
}

// Generate Dynamic Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Article non trouvé',
      description: 'Cet article n\'existe pas'
    }
  }

  const title = article.title;
  const description = article.excerpt || article.content?.substring(0, 160) || 'Article de blog Ween Maintenance';
  const images = article.image_url ? [article.image_url] : [];

  return {
    title,
    description,
    alternates: {
      canonical: `/blogs/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.created_at,
      authors: [article.author || 'Ween Team'],
      images,
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
  const article = await getArticle(slug);

  if (!article) {
    return <ArticleContent article={null} relatedArticles={[]} />
  }

  const relatedArticles = await getRelatedArticles(article.category, slug);

  // JSON-LD for Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    image: article.image_url ? [article.image_url] : [],
    datePublished: article.created_at,
    author: {
      '@type': 'Person',
      name: article.author || 'Ween Maintenance Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ween Maintenance',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ween-maintenance.tn/WEEN-maintenance.png'
      }
    },
    description: article.excerpt || article.content?.substring(0, 160),
    articleBody: article.content
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleContent article={article} relatedArticles={relatedArticles} />
    </>
  )
}
