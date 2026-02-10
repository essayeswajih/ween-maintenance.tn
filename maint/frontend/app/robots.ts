import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/cart', '/login', '/register'],
        },
        sitemap: 'https://ween-maintenance.tn/sitemap.xml',
    }
}
