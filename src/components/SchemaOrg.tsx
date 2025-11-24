import { Helmet } from 'react-helmet-async';

interface SchemaOrgProps {
  type?: 'Organization' | 'LocalBusiness' | 'Article' | 'FAQPage';
  data?: any;
}

export default function SchemaOrg({ type = 'Organization', data }: SchemaOrgProps) {
  const getSchema = () => {
    switch (type) {
      case 'Organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Kilolab",
          "url": "https://kilolab.fr",
          "logo": "https://kilolab.fr/logo.png",
          "description": "Le pressing nouvelle génération au kilo. 2600+ pressings partenaires en France et Belgique.",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "FR"
          },
          "sameAs": [
            "https://facebook.com/kilolab",
            "https://twitter.com/kilolab",
            "https://instagram.com/kilolab"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+33-1-XX-XX-XX-XX",
            "contactType": "Customer Service",
            "email": "contact@kilolab.fr",
            "availableLanguage": ["French"]
          }
        };

      case 'LocalBusiness':
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": data?.name || "Kilolab Pressing",
          "image": "https://kilolab.fr/og-image.jpg",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": data?.address,
            "addressLocality": data?.city,
            "postalCode": data?.postal_code,
            "addressCountry": "FR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": data?.latitude,
            "longitude": data?.longitude
          },
          "telephone": data?.phone,
          "priceRange": "€€",
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "19:00"
            }
          ]
        };

      case 'Article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data?.title,
          "description": data?.description,
          "image": data?.image,
          "author": {
            "@type": "Organization",
            "name": "Kilolab"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Kilolab",
            "logo": {
              "@type": "ImageObject",
              "url": "https://kilolab.fr/logo.png"
            }
          },
          "datePublished": data?.datePublished,
          "dateModified": data?.dateModified
        };

      case 'FAQPage':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data?.questions?.map((q: any) => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": q.answer
            }
          }))
        };

      default:
        return {};
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(getSchema())}
      </script>
    </Helmet>
  );
}
