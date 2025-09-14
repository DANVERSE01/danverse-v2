import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ar'],

  // Used when no locale matches
  defaultLocale: 'en',

  // The `pathnames` object holds pairs of internal and
  // external paths. Based on the locale, the external
  // paths are rewritten to the shared, internal ones.
  pathnames: {
    // If all locales use the same pathname, a single
    // string or only the internal pathname can be provided
    '/': '/',
    '/services': '/services',
    '/portfolio': '/portfolio',
    '/academy': '/academy',
    '/about': '/about',
    '/contact': '/contact',
    '/pre-enrollment': '/pre-enrollment',
    '/privacy': '/privacy',
    '/terms': '/terms',
    '/admin': '/admin'
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

