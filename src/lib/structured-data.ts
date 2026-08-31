import {
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_NAME,
  SITE_OPENING_HOURS,
  SITE_PHONE_E164,
  SITE_URL,
} from "@/constants/site";

/**
 * Restaurant JSON-LD (schema.org), limited to information actually provided by
 * the client. Days without an entry in SITE_OPENING_HOURS are closed and are
 * intentionally omitted rather than guessed.
 */
export function buildRestaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE_NAME,
    url: SITE_URL,
    telephone: SITE_PHONE_E164,
    email: SITE_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_ADDRESS.streetAddress,
      addressLocality: SITE_ADDRESS.addressLocality,
      postalCode: SITE_ADDRESS.postalCode,
      addressCountry: SITE_ADDRESS.addressCountry,
    },
    openingHoursSpecification: SITE_OPENING_HOURS.map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: entry.dayOfWeek,
      opens: entry.opens,
      closes: entry.closes,
    })),
  };
}
