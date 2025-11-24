import { Helmet } from 'react-helmet-async';

interface PageHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

export default function PageHead({
  title = 'Kilolab - Le pressing nouvelle génération au kilo',
  description = 'Déposez votre linge en point relais, récupérez-le impeccable en 24h. Prix au kilo transparents dès 3,50€/kg. 2600+ pressings partenaires en France.',
  canonical = 'https://kilolab.fr',
  ogImage = 'https://kilolab.fr/og-image.jpg',
  ogType = 'website',
  noindex = false
}: PageHeadProps) {
  return (
    <Helmet>
      {/* Basic */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Noindex si nécessaire */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Kilolab" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO */}
      <meta name="author" content="Kilolab" />
      <meta name="language" content="French" />
      <meta name="geo.region" content="FR" />
      <meta name="geo.placename" content="France" />
    </Helmet>
  );
}
