import { SITE } from './site';

export const localBusinessSchema = (areas = []) => ({
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  '@id': `${SITE.url}/#business`,
  name: SITE.legalName,
  alternateName: SITE.name,
  description: 'صباغ منازل وفلل، أصباغ داخلية وخارجية، تركيب بديل الرخام والخشب والجبس بورد ومعالجة الرطوبة في الكويت.',
  telephone: SITE.intl,
  url: SITE.url,
  image: SITE.ogImage,
  logo: SITE.logo,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    addressCountry: 'KW',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  areaServed: areas.map((a) => ({ '@type': 'AdministrativeArea', name: a })),
  ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: SITE.url,
  inLanguage: 'ar-KW',
});

export const serviceSchema = (name, description, path) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: name,
  name,
  description,
  url: `${SITE.url}${path}`,
  provider: { '@type': 'HomeAndConstructionBusiness', '@id': `${SITE.url}/#business`, name: SITE.name, telephone: SITE.intl },
  areaServed: { '@type': 'Country', name: 'الكويت' },
});

export const faqSchema = (faqs = []) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE.url}${it.url}`,
  })),
});

export const articleSchema = (a) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: a.title,
  description: a.snippet || (a.content || '').substring(0, 150),
  image: a.image_url || SITE.ogImage,
  datePublished: a.published_at || a.created_at,
  dateModified: a.updated_at || a.published_at || a.created_at,
  mainEntityOfPage: `${SITE.url}/blog/${a.slug}/`,
  author: { '@type': 'Organization', name: SITE.name },
  publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: SITE.logo } },
});
