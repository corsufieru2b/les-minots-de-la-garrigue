import type { Metadata } from "next";

import { Container, Section, Surface, Typography, VStack } from "@/components/ui";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Mentions légales",
  "Mentions légales du site Les Minots de la Garrigue.",
  "/mentions-legales",
);

export default function LegalNoticePage() {
  return (
    <SitePageShell>
      <Section spacing="xl" background="surface">
        <Container size="md">
          <Surface variant="outline">
            <VStack spacing="xl">
              <VStack spacing="sm">
                <Typography variant="h2" as="h1">Mentions légales</Typography>
                <Typography variant="body" tone="secondary">
                  Informations relatives à l&apos;éditeur, à l&apos;hébergement et aux conditions d&apos;utilisation du site.
                </Typography>
              </VStack>

              <VStack spacing="sm">
                <Typography variant="h3" as="h2">Éditeur du site</Typography>
                <Typography variant="body" tone="secondary">
                  SAS LEOMAR<br />
                  Enseigne : Les Minots de la Garrigue<br />
                  Capital social : 10 000 €<br />
                  Siège social : 37 avenue Alphonse Denis, 83400 Hyères, France<br />
                  SIREN : 943 413 534<br />
                  SIRET : 943 413 534 00018<br />
                  RCS Toulon<br />
                  TVA intracommunautaire : FR28 943 413 534<br />
                  Téléphone : 04 23 14 32 61<br />
                  Email : leomar.hyeres@gmail.com
                </Typography>
              </VStack>

              <VStack spacing="sm">
                <Typography variant="h3" as="h2">Directeurs de la publication</Typography>
                <Typography variant="body" tone="secondary">
                  Léo Himeur, Président<br />
                  Martin Himeur, Directeur général
                </Typography>
              </VStack>

              <VStack spacing="sm">
                <Typography variant="h3" as="h2">Hébergement</Typography>
                <Typography variant="body" tone="secondary">
                  Vercel Inc.<br />
                  Site : vercel.com
                </Typography>
              </VStack>

              <VStack spacing="sm">
                <Typography variant="h3" as="h2">Conception et réalisation</Typography>
                <Typography variant="body" tone="secondary">
                  Site conçu et développé par : Corsutech
                </Typography>
              </VStack>

              <VStack spacing="sm">
                <Typography variant="h3" as="h2">Propriété intellectuelle</Typography>
                <Typography variant="body" tone="secondary">
                  Les contenus présents sur ce site sont protégés par les règles applicables à la propriété intellectuelle.
                  Les textes, l&apos;identité visuelle, les éléments graphiques et les contenus appartenant à LEOMAR ne peuvent
                  pas être reproduits, représentés, adaptés ou exploités sans autorisation préalable. Les photographies et
                  contenus appartenant à des tiers restent soumis aux droits de leurs auteurs ou propriétaires respectifs.
                </Typography>
              </VStack>

              <VStack spacing="sm">
                <Typography variant="h3" as="h2">Responsabilité</Typography>
                <Typography variant="body" tone="secondary">
                  LEOMAR veille à fournir des informations aussi exactes et à jour que possible. Des erreurs, omissions ou
                  interruptions temporaires du site peuvent toutefois survenir. Les liens vers des sites tiers sont proposés
                  à titre informatif ; LEOMAR ne contrôle pas leur contenu et ne peut être tenue responsable de leurs propres
                  pratiques ou disponibilités.
                </Typography>
              </VStack>
            </VStack>
          </Surface>
        </Container>
      </Section>
    </SitePageShell>
  );
}