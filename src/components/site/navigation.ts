export type SiteNavItem = {
  label: string;
  href: string;
};

export const siteNavItems: SiteNavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Notre histoire", href: "/notre-histoire" },
  { label: "Notre cuisine", href: "/notre-cuisine" },
  { label: "Galerie", href: "/galerie" },
  { label: "Reserver", href: "/reservation" },
  { label: "Avis", href: "/avis" },
  { label: "Contact", href: "/contact" },
  { label: "Devis", href: "/devis" },
];
