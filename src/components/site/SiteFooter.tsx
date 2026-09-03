import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { Container, Divider, Grid, HStack, IconWrapper, Typography, VStack } from "@/components/ui";

import { siteNavItems } from "./navigation";
import styles from "@/app/page.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Container size="2xl">
        <Grid columns={4} className={styles.footerGrid}>
          <VStack spacing="sm">
            <Typography variant="h4">Les Minots de la Garrigue</Typography>
            <Typography variant="small" tone="secondary">
              Cuisine mediterraneenne moderne dans un cadre chaleureux et lumineux.
            </Typography>
          </VStack>

          <VStack spacing="sm">
            <Typography variant="small">Navigation</Typography>
            {siteNavItems.map((item) => (
              <Link key={`footer-${item.label}`} href={item.href} className={styles.footerLink}>
                <Typography variant="caption" tone="secondary">
                  {item.label}
                </Typography>
              </Link>
            ))}
          </VStack>

          <VStack spacing="sm">
            <Typography variant="small">Reseaux</Typography>
            <HStack spacing="sm">
              <a
                href="https://www.instagram.com/lesminotsdelagarrigue?igsi=cDl6anMxaG9mbGV3"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram des Minots de la Garrigue"
              >
                <IconWrapper variant="outline" size="md" className={styles.footerSocialIcon}>
                  <Typography variant="caption">IG</Typography>
                </IconWrapper>
              </a>
            </HStack>
          </VStack>

          <VStack spacing="sm">
            <Typography variant="small">Legal</Typography>
            <Link href="/mentions-legales" className={styles.footerLink}>
              <Typography variant="caption" tone="secondary">
                Mentions legales
              </Typography>
            </Link>
            <Link href="/politique-de-confidentialite" className={styles.footerLink}>
              <Typography variant="caption" tone="secondary">
                Politique de confidentialite
              </Typography>
            </Link>
          </VStack>
        </Grid>

        <Divider className={styles.footerDivider} />
        <HStack spacing="sm" className={styles.footerBottom}>
          <CalendarDays size={14} />
          <Typography variant="caption" tone="secondary">
            © 2026 Les Minots de la Garrigue. Tous droits reserves.
          </Typography>
        </HStack>
      </Container>
    </footer>
  );
}
