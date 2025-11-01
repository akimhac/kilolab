import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  noindex?: boolean;
}

export default function SEO({
  title = 'KiloLab - Pressing au kilo, simple et rapide',
  description = 'Service de pressing au kilo avec points relais. Déposez votre linge, nous le lavons, repassons et emballons. Formules Premium, Express 24h et Ultra Express 6h disponibles.',
  keywords = 'pressing, laverie, nettoyage, linge, kilo, express, premium, point relais, service',
  ogImage = '/og-image.jpg',
  ogUrl = 'https://kilolab.fr',
  noindex = false,
}: SEOProps) {
  const siteName = 'KiloLab';
  const fullTitle = title.includes('KiloLab') ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={ogUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="author" content="KiloLab" />
      <link rel="canonical" href={ogUrl} />
      <meta name="theme-color" content="#667eea" />
    </Helmet>
  );
}

export const LandingPageSEO = () => (
  <SEO
    title="KiloLab - Pressing au kilo, simple et rapide"
    description="Déposez votre linge dans nos points relais partenaires. Nous le lavons, séchons, repassons et emballons. Service Premium 72-96h, Express 24h ou Ultra Express 6h."
    keywords="pressing au kilo, laverie express, nettoyage linge, service pressing, point relais, lavage express"
  />
);

export const LoginSEO = () => <SEO title="Connexion" description="Connectez-vous à votre espace KiloLab." noindex={true} />;

export const RegisterSEO = () => <SEO title="Inscription" description="Créez votre compte KiloLab." noindex={true} />;

export const ClientDashboardSEO = () => <SEO title="Mon espace client" description="Gérez vos commandes de pressing." noindex={true} />;

export const PartnerDashboardSEO = () => <SEO title="Espace partenaire" description="Gérez vos commandes partenaire." noindex={true} />;

export const PartnersMapSEO = () => (
  <SEO
    title="Nos points relais partenaires"
    description="Trouvez le point relais KiloLab le plus proche de chez vous."
    keywords="points relais, partenaires pressing, localisation, carte"
  />
);

export const NewOrderSEO = () => <SEO title="Nouvelle commande" description="Créez votre commande de pressing." noindex={true} />;
