// src/components/SEO.tsx
// Composant SEO avancé avec meta tags dynamiques et Open Graph

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  noindex?: boolean;
  canonical?: string;
  structuredData?: object;
}

const defaultMeta = {
  title: 'Kilolab - Le pressing au kilo, simple et transparent',
  description: 'Trouvez votre pressing partenaire parmi plus de 2600 établissements en France. Tarifs transparents à partir de 3,50€/kg. Lavage, repassage, nettoyage à sec.',
  keywords: ['pressing', 'laverie', 'nettoyage', 'linge', 'kilo', 'france', 'lavage', 'repassage'],
  image: 'https://kilolab.fr/og-image.jpg',
  url: 'https://kilolab.fr',
  siteName: 'Kilolab',
  twitterHandle: '@kilolab_fr'
};

export default function SEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  noindex = false,
  canonical,
  structuredData
}: SEOProps) {
  const fullTitle = title 
    ? `${title} | Kilolab` 
    : defaultMeta.title;
  
  const fullDescription = description || defaultMeta.description;
  const fullImage = image || defaultMeta.image;
  const fullUrl = url || defaultMeta.url;
  const allKeywords = [...defaultMeta.keywords, ...keywords].join(', ');

  // Schema.org par défaut pour l'organisation
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kilolab',
    description: defaultMeta.description,
    url: 'https://kilolab.fr',
    logo: 'https://kilolab.fr/logo.png',
    sameAs: [
      'https://www.facebook.com/kilolab',
      'https://twitter.com/kilolab_fr',
      'https://www.instagram.com/kilolab_fr',
      'https://www.linkedin.com/company/kilolab'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+33-1-XX-XX-XX-XX',
      contactType: 'customer service',
      availableLanguage: ['French']
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR'
    }
  };

  return (
    <Helmet>
      {/* Balises de base */}
      <html lang="fr" />
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author || 'Kilolab'} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#7c3aed" />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Canonical */}
      <link rel="canonical" href={canonical || fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={defaultMeta.siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Article specific */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={defaultMeta.twitterHandle} />
      <meta name="twitter:creator" content={defaultMeta.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Apple */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Kilolab" />
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      
      {/* Favicons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Preconnect pour performances */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.resend.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//supabase.co" />
      <link rel="dns-prefetch" href="//api.qrserver.com" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  );
}

// ============================================
// STRUCTURED DATA HELPERS
// ============================================

export const createLocalBusinessSchema = (partner: {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'DryCleaningOrLaundry',
  name: partner.name,
  address: {
    '@type': 'PostalAddress',
    streetAddress: partner.address,
    addressLocality: partner.city,
    postalCode: partner.postalCode,
    addressCountry: 'FR'
  },
  ...(partner.phone && { telephone: partner.phone }),
  ...(partner.latitude && partner.longitude && {
    geo: {
      '@type': 'GeoCoordinates',
      latitude: partner.latitude,
      longitude: partner.longitude
    }
  }),
  ...(partner.rating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: partner.rating,
      reviewCount: partner.reviewCount || 0
    }
  }),
  priceRange: partner.priceRange || '€€'
});

export const createBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});

export const createFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

export const createArticleSchema = (article: {
  title: string;
  description: string;
  image: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  image: article.image,
  author: {
    '@type': 'Person',
    name: article.author
  },
  publisher: {
    '@type': 'Organization',
    name: 'Kilolab',
    logo: {
      '@type': 'ImageObject',
      url: 'https://kilolab.fr/logo.png'
    }
  },
  datePublished: article.publishedDate,
  dateModified: article.modifiedDate || article.publishedDate,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': article.url
  }
});

export const createServiceSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Pressing au kilo',
  provider: {
    '@type': 'Organization',
    name: 'Kilolab'
  },
  areaServed: {
    '@type': 'Country',
    name: 'France'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services de pressing',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Lavage Standard',
          description: 'Lavage et séchage au kilo'
        },
        price: '3.50',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '3.50',
          priceCurrency: 'EUR',
          unitText: 'kg'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Lavage Express',
          description: 'Lavage express en 4h'
        },
        price: '5.00',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '5.00',
          priceCurrency: 'EUR',
          unitText: 'kg'
        }
      }
    ]
  }
});
