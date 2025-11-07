import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function SEOHead({
  title = 'KiloLab - Pressing au kilo, livré en 24h',
  description = 'Service de pressing nouvelle génération. Lavage, séchage, pliage, emballage. Déposez votre linge, on s\'occupe du reste. À partir de 5€/kg.',
  image = 'https://kilolab.fr/og-image.jpg',
  url = 'https://kilolab.fr',
}: SEOHeadProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "KiloLab",
          "description": description,
          "url": url,
          "priceRange": "€€",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "500"
          }
        })}
      </script>
    </Helmet>
  );
}
