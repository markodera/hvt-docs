import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getSeoMeta } from '../docsData';

const BASE_URL = 'https://docs.hvts.app';
const OG_IMAGE = `${BASE_URL}/web-app-manifest-512x512.png`;
const DATE_MODIFIED = '2026-04-09';

export default function PageSEO() {
  const { pathname } = useLocation();
  const { title, description, breadcrumbs } = getSeoMeta(pathname);
  const canonical = `${BASE_URL}${pathname}`;

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    name: title,
    description,
    url: canonical,
    dateModified: DATE_MODIFIED,
    author: {
      '@type': 'Organization',
      '@id': 'https://hvts.app/#organization',
      name: 'HVT',
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://hvts.app/#organization',
      name: 'HVT',
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:type" content="article" />

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />

      {/* JSON-LD: TechArticle */}
      <script type="application/ld+json">{JSON.stringify(techArticleSchema)}</script>

      {/* JSON-LD: BreadcrumbList */}
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </Helmet>
  );
}
