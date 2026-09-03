import type { Metadata } from "next";

import { Container, Section, Surface, Typography, VStack } from "@/components/ui";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Politique de confidentialité",
  "Politique de confidentialité du site Les Minots de la Garrigue.",
  "/politique-de-confidentialite",
);

export default function PrivacyPolicyPage() {
  return (
    <SitePageShell>
      <Section spacing="xl" background="surface">
        <Container size="md">
          <Surface variant="outline">
            <VStack spacing="xl">
              <VStack spacing="sm">
                <Typography variant="h2" as="h1">Politique de confidentialité</Typography>
                <Typography variant="body" tone="secondary">
                  Cette page décrit les traitements de données réellement effectués sur le site Les Minots de la Garrigue.
                </Typography>
              </VStack>

              <VStack spacing="sm">
                <Typography variant="h3" as="h2">Responsable du traitement</Typography>
                <Typography variant="body" tone="secondary">
                  SAS LEOMAR<br />
                  37 avenue Alphonse Denis<br />
                  83400 Hyères<br />
                  Email : leomar.hyeres@gmail.com<br />
                  Téléphone : 04 23 14 32 61
                </Typography>
              </VStack>

              <VStack spacing="sm">
                <Typography variant="h3" as="h2">Données liées aux réservations</Typography>
                <Typography variant="body" tone="secondary">
                  Le formulaire de réservation collecte les informations saisies par l&apos;utilisateur : nom, téléphone, email,
                  nombre de personnes, date, heure et commentaire éventuel. Ces données sont utilisées pour enregistrer et
                  gérer la réservation, envoyer la confirmation, prévenir le restaurant, permettre l&apos;annulation sécurisée et
                  assurer le suivi nécessaire de la réservation.
                </Typography>
              </VStack>

              <VStack spacing="sm">
                <Typography variant="h3" as="h2">Données liées aux demandes Traiteur</Typography>
                <Typography variant="body" tone="secondary">
                  Le formulaire Traiteur collecte les informations saisies par l&apos;utilisateur : nom, entreprise si renseignée,
                  téléphone, email et description du projet. Ces données sont utilisées pour recevoir la demande, contacter
                  le demandeur, préparer et suivre la demande de devis ou de prestation.
                </Typography>
              </VStack>

              <VStack spacing="sm">
                <Typography variant="h3" as="h2">Bases juridiques</Typography>
                <Typography variant="body" tone="secondary">
                  Les traitements liés aux réservations et aux demandes Traiteur reposent sur l&apos;exécution de mesures prises
                  à la demande de l&apos;utilisateur. Les traitements liés à la sécurité, à la prévention des abus et à la protection
                  des formulaires reposent sur l&apos;intérêt légitime de LEOMAR à sécuriser le site et ses services.
                </Typography>
              </VStack>

              <VStack spacing="sm">
                <Typography variant="h3" as="h2">Prestataires techniques</Typography>
                <Typography variant="body" tone="secondary">
                  Vercel assure l&apos;hébergement et l&apos;infrastructure du site. Supabase assure le stockage sécurisé des données
                  nécessaires au module de réservation. Resend assure l&apos;envoi des emails transactionnels liés aux formulaires
                  et réservations. Cloudflare Turnstile protège les formulaires publics contre les soumissions automatisées
                  et abusives, sous réserve de sa configuration en production. Upstash Redis est utilisé pour le rate limiting
                  et reçoit uniquement les informations techniques nécessaires à la limitation des abus, notamment un identifiant
                  technique lié à l&apos;adresse IP.
                </Typography>
              </VStack>

              <VStack spacing="sm">
                <Typography variant="h3" as="h2">Durée de conservation</Typography>
                <Typography variant="body" tone="secondary">
                  Les données sont conservées uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont
                  été collectées et aux obligations légales applicables. Aucune politique automatique de suppression n&apos;est
                  actuellement définie dans le code du site.
                </Typography>
              </VStack>

              <VStack spacing="sm">
                <Typography variant="h3" as="h2">Droits des utilisateurs</Typography>
                <Typography variant="body" tone="secondary">
                  Vous pouvez demander l&apos;accès, la rectification, l&apos;effacement, la limitation, l&apos;opposition lorsque applicable
                  et la portabilité lorsque applicable de vos données. Pour exercer ces droits, contactez : leomar.hyeres@gmail.com.
                  Vous pouvez également introduire une réclamation auprès de la CNIL.
                </Typography>
              </VStack>

              <VStack spacing="sm">
                <Typography variant="h3" as="h2">Cookies et traceurs</Typography>
                <Typography variant="body" tone="secondary">
                  Le site ne met pas en place de solution d&apos;analytics, de pixel publicitaire ou de prospection marketing. Le
                  code du site n&apos;utilise pas de cookies applicatifs, localStorage ou sessionStorage pour suivre les visiteurs.
                  Google Maps est intégré sur la page Contact et Cloudflare Turnstile peut être chargé sur les formulaires ;
                  ces services tiers peuvent utiliser des mécanismes techniques nécessaires à leur fonctionnement et appliquent
                  leurs propres politiques.
                </Typography>
              </VStack>

              <VStack spacing="sm">
                <Typography variant="h3" as="h2">Sécurité</Typography>
                <Typography variant="body" tone="secondary">
                  LEOMAR met en œuvre des mesures techniques et organisationnelles raisonnables pour protéger les données,
                  notamment la validation serveur, la limitation des abus, la protection anti-bot, le contrôle des accès serveur
                  et l&apos;absence d&apos;exposition des clés secrètes côté navigateur. Ces mesures ne constituent pas une garantie de
                  sécurité absolue.
                </Typography>
              </VStack>
            </VStack>
          </Surface>
        </Container>
      </Section>
    </SitePageShell>
  );
}