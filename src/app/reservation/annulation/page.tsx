import type { Metadata } from "next";

import { ReservationCancellationForm } from "@/components/forms/ReservationCancellationForm";
import { Badge, Grid, Section, Surface, Typography, VStack } from "@/components/ui";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

import styles from "@/app/page.module.css";

export const metadata: Metadata = buildPageMetadata(
  "Annulation de réservation",
  "Annulez une réservation aux Minots de la Garrigue depuis le lien sécurisé reçu par email.",
  "/reservation/annulation",
);

export default async function ReservationCancellationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <SitePageShell>
      <Section spacing="xl" background="surface">
        <Grid columns={2} className={styles.formGrid}>
          <Surface variant="outline" className={styles.formPanel}>
            <VStack spacing="lg">
              <Badge tone="neutral" variant="soft">
                Réservation
              </Badge>
              <Typography variant="h3" as="h1">Annuler une réservation</Typography>
              <Typography variant="small" tone="secondary">
                L&apos;annulation en ligne est possible jusqu&apos;à 24 h avant l&apos;horaire prévu.
              </Typography>
              <ReservationCancellationForm token={token ?? null} />
            </VStack>
          </Surface>
        </Grid>
      </Section>
    </SitePageShell>
  );
}