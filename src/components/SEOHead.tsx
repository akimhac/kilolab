import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
}

export default function SEOHead({ 
  title = "Kilolab - Le Pressing Nouvelle Génération au Kilo", 
  description = "Fini la corvée de lessive. Kilolab collecte, lave, plie et livre votre linge au kilo. Simple, économique, écologique. Commandez en 2 minutes.",
  canonical 
}: SEOProps) {
  
  const siteTitle = title.includes('Kilolab') ? title : `${title} | Kilolab`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://kilolab.fr/og-image.jpg" /> {/* Faudra mettre une image ici */}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      
      {/* Canonical */}
      {canonical && <link rel="canonical" href={`https://kilolab.fr${canonical}`} />}
    </Helmet>
  );
}
