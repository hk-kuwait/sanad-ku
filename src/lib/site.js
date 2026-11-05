export const SITE = {
  name: 'شركة سند الكويت',
  legalName: 'شركة سند الكويت لتشييد المباني والأصباغ',
  url: 'https://sanadkw.com',
  phone: '65587628',
  intl: '+96565587628',
  wa: '96565587628',
  ogImage: 'https://sanadkw.com/og-image.jpg',
  logo: 'https://sanadkw.com/logo.png',
  // أضف روابط حساباتك الحقيقية هنا (فيسبوك / انستجرام / خرائط جوجل)
  sameAs: [],
  address: {
    street: 'قطعة 11، شارع شرحبيل، مجمع دلال، مكتب 14',
    locality: 'حولي',
    region: 'محافظة حولي',
    full: 'حولي، قطعة 11، شارع شرحبيل، مجمع دلال، مكتب 14، الكويت',
  },
};

export const waLink = (
  text = 'السلام عليكم، أود الاستفسار عن خدمات الأصباغ والديكور والمعاينة لدى شركة سند الكويت.'
) => `https://wa.me/${SITE.wa}?text=${encodeURIComponent(text)}`;

export const NAV = [
  { href: '/', label: 'الرئيسية' },
  { href: '/painting-services/', label: 'صباغ الكويت' },
  { href: '/house-painter-kuwait/', label: 'صباغ شقق وفلل' },
  { href: '/marble-wood-alternative/', label: 'بديل الرخام والخشب' },
  { href: '/gallery/', label: 'معرض الأعمال' },
  { href: '/blog/', label: 'المدونة' },
  { href: '/about/', label: 'من نحن' },
  { href: '/contact/', label: 'اتصل بنا' },
];

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('ar-KW-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
