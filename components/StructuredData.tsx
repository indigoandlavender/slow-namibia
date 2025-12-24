export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Slow Namibia",
    description: "Thoughtful private journeys across Namibia — designed for travellers who prefer ease and deep immersion.",
    url: "https://slownamibia.com",
    email: "hello@slownamibia.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Windhoek",
      addressCountry: "NA",
    },
    areaServed: {
      "@type": "Country",
      name: "Namibia",
    },
    image: "https://slownamibia.com/og-image.jpg",
    priceRange: "€€€",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Namibia Private Journeys",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "Sossusvlei & Deadvlei",
            description: "The iconic red dunes of the Namib Desert",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "Etosha Safari",
            description: "Wildlife encounters at the great salt pan",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "Skeleton Coast Explorer",
            description: "The wild Atlantic coast of Namibia",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
