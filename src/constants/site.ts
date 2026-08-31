export const SITE_NAME = "Les Minots de la Garrigue";
export const SITE_DESCRIPTION =
  "Restaurant à Hyères : cuisine méditerranéenne de saison, produits locaux et circuit court, imaginée par Martin.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Coordonnées officielles du restaurant, réutilisées pour les metadata et les donnees structurees.
export const SITE_ADDRESS = {
  streetAddress: "37 Av. Alphonse Denis",
  addressLocality: "Hyères",
  postalCode: "83400",
  addressCountry: "FR",
} as const;

export const SITE_PHONE_DISPLAY = "04 23 14 32 61";
export const SITE_PHONE_E164 = "+33423143261";
export const SITE_EMAIL = "leomar.hyeres@gmail.com";

// Horaires reels fournis par le client (utilises dans le JSON-LD Restaurant).
export const SITE_OPENING_HOURS = [
  { dayOfWeek: "Tuesday", opens: "08:00", closes: "22:30" },
  { dayOfWeek: "Wednesday", opens: "08:00", closes: "22:00" },
  { dayOfWeek: "Thursday", opens: "08:00", closes: "22:00" },
  { dayOfWeek: "Friday", opens: "08:00", closes: "22:00" },
  { dayOfWeek: "Saturday", opens: "08:00", closes: "17:00" },
] as const;

// Image reelle du restaurant reutilisee pour Open Graph / Twitter (aucune image creee).
export const SITE_OG_IMAGE = "/images/hero/Hero-01.webp.jpeg";
export const SITE_OG_IMAGE_ALT = "Les Minots de la Garrigue, terrasse du restaurant à Hyères";
