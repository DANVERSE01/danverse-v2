import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://danverse.ai'
  
  // Static pages for both locales
  const staticPages = [
    '',
    '/about',
    '/portfolio',
    '/academy',
    '/offers',
    '/buy',
  ]
  
  const locales = ['en', 'ar']
  
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  // Add root page
  sitemapEntries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  })
  
  // Add localized pages
  locales.forEach(locale => {
    staticPages.forEach(page => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 0.9 : 0.8,
      })
    })
  })
  
  return sitemapEntries
}

