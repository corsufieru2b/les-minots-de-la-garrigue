"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  AppImage,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Fade,
  Flex,
  Grid,
  HStack,
  IconWrapper,
  Reveal,
  Scale,
  Section,
  Surface,
  Typography,
  VStack,
} from "@/components/ui";
import srOnlyStyles from "@/components/ui/utilities/Utilities.module.css";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";

import styles from "@/app/page.module.css";

export type CuisineImage = {
  alt: string;
  src: string;
};

const galleryImages = [
  "/images/galerie/galerie-01.webp.jpeg",
  "/images/galerie/galerie-02.webp.jpeg",
  "/images/galerie/galerie-03.webp.jpeg",
  "/images/galerie/galerie-04.webp.jpeg",
  "/images/galerie/galerie-05.webp.jpeg",
];

type PressArticle = {
  media: string;
  title: string;
  excerpt: string;
  mediaLogoSrc: string;
  mediaLogoAlt: string;
  ctaLabel: string;
  articleUrl?: string;
};

const CONTACT_ADDRESS_LINE_1 = "37 Av. Alphonse Denis";
const CONTACT_ADDRESS_LINE_2 = "83400 Hyères";
const CONTACT_PHONE_DISPLAY = "04 23 14 32 61";
const CONTACT_PHONE_HREF = "tel:+33423143261";
const CONTACT_EMAIL = "leomar.hyeres@gmail.com";
const GOOGLE_MAPS_SHARE_URL = "https://maps.app.goo.gl/pH4f7RoDEQJrEuER7?g_st=ic";
const GOOGLE_MAPS_EMBED_SRC =
  "https://www.google.com/maps?q=37+Av.+Alphonse+Denis,+83400+Hy%C3%A8res&output=embed";

const restaurantHours = [
  { day: "Lundi", time: "Fermé" },
  { day: "Mardi", time: "8h00 – 22h30" },
  { day: "Mercredi", time: "8h00 – 22h00" },
  { day: "Jeudi", time: "8h00 – 22h00" },
  { day: "Vendredi", time: "8h00 – 22h00" },
  { day: "Samedi", time: "8h00 – 17h00" },
  { day: "Dimanche", time: "Fermé" },
] as const;

const pressArticles: PressArticle[] = [
  {
    media: "Guide Michelin",
    title: "Recommandé par le Guide Michelin",
    excerpt:
      "Le Guide Michelin met en avant Les Minots de la Garrigue pour sa cuisine méditerranéenne de saison, son cadre chaleureux et sa terrasse arborée. Une reconnaissance qui souligne la qualité de l'expérience proposée aux visiteurs.",
    mediaLogoSrc: "/images/medias/guide-Michelin.webp",
    mediaLogoAlt: "Logo Guide Michelin",
    articleUrl:
      "https://guide.michelin.com/fr/fr/provence-alpes-cote-dazur/hyres/restaurant/les-minots-de-la-garrigue",
    ctaLabel: "Lire l'article →",
  },
  {
    media: "Gault&Millau",
    title: "Sélectionné par Gault&Millau",
    excerpt:
      "Gault&Millau met en avant Les Minots de la Garrigue pour sa cuisine méditerranéenne, ses produits de saison et son ambiance conviviale. Le guide souligne également la qualité des poissons de pêche locale, l'accueil de l'équipe et le cadre agréable de la terrasse.",
    mediaLogoSrc: "/images/media/gault-millau.webp",
    mediaLogoAlt: "Logo Gault&Millau",
    articleUrl: "https://fr.gaultmillau.com/fr/restaurants/les-minots-de-la-garrigue",
    ctaLabel: "Lire l'article →",
  },
];

export function HeroSection() {
  const router = useRouter();

  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.heroOverlay} aria-hidden="true" />

      <Container size="xl">
        <div className={styles.heroGrid}>
          <Fade className={styles.heroContent}>
            {/* Visually hidden: keeps the validated image-only Hero design while giving the page a real H1 for SEO. */}
            <Typography variant="h1" as="h1" className={srOnlyStyles.srOnly}>
              Les Minots de la Garrigue, restaurant à Hyères
            </Typography>
            <div className={styles.heroActions}>
              <Button
                variant="primary"
                size="lg"
                className={`${styles.heroButton} ${styles.heroButtonPrimary}`}
                onClick={() => router.push("/reservation")}
              >
                Réserver une table
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`${styles.heroButton} ${styles.heroButtonSecondary}`}
                onClick={() => router.push("/notre-histoire")}
              >
                Découvrir le restaurant
              </Button>
            </div>
          </Fade>
        </div>
      </Container>
    </section>
  );
}

export function StorySection() {
  return (
    <Section spacing="xl" background="background">
      <Grid columns={2} className={styles.storyGrid}>
        <Reveal>
          <VStack spacing="lg">
            <Badge tone="neutral" variant="soft">
              Notre histoire
            </Badge>
            <Typography variant="h1">Deux freres, une terre, une table</Typography>
            <Typography variant="bodyLarge" tone="secondary">
              Nous sommes Léo et Martin, deux frères natifs d&apos;Hyères, profondément attachés à
              notre terre, à la mer et à la nature.
            </Typography>
            <Typography variant="body" tone="secondary">
              Petits-fils de maraîcher et fils de pêcheur amateur, nous avons grandi au rythme
              des grandes tablées sous les oliviers, des légumes du jardin et du poisson rapporté
              par notre père.
            </Typography>
            <Typography variant="body" tone="secondary">
              Au restaurant Les Minots de la Garrigue, nous souhaitons partager cette histoire et
              notre passion pour les bons moments autour d&apos;une table. Dans l&apos;assiette comme dans
              le verre, nous mettons à l&apos;honneur, au fil des saisons, les produits et les
              savoir-faire qui font la richesse de notre terroir.
            </Typography>
          </VStack>
        </Reveal>
        <Scale>
          <Card variant="premium" className={styles.storyImageCard}>
            <AppImage
              src="/images/restaurant/Terrasse-01.webp.jpeg"
              alt="Terrasse ombragee du restaurant entouree de vegetation"
              width={1600}
              height={1200}
              sizes="(max-width: 47.99rem) 100vw, 50vw"
              priority
              variant="rounded"
              className={styles.storyImage}
            />
          </Card>
        </Scale>
      </Grid>
    </Section>
  );
}

export function CuisineSection({ cuisineImages = [] }: { cuisineImages?: CuisineImage[] }) {
  return (
    <Section spacing="xl" background="surface">
      <VStack spacing="xl">
        <VStack spacing="md" className={styles.sectionHeading}>
          <Badge tone="info" variant="outline">
            Notre cuisine
          </Badge>
          <Typography variant="h2" as="h1">Une cuisine maison inspiree de la Mediterranee</Typography>
          <Typography variant="body" tone="secondary">
            En cuisine, Martin défend une idée simple : partir du produit avant de penser à
            l&apos;assiette.
          </Typography>
          <Typography variant="body" tone="secondary">
            Nous privilégions les producteurs d&apos;Hyères et des alentours, en travaillant au
            maximum en circuit court, avec le moins d&apos;intermédiaires possible. Une façon de mieux
            connaître celles et ceux qui font nos produits, de privilégier une rémunération juste
            et de créer un véritable lien entre le producteur, la cuisine et ceux qui passent à
            table.
          </Typography>
          <Typography variant="body" tone="secondary">
            Légumes, poissons, viandes ou produits de saison : nous travaillons avant tout des
            produits bruts, locaux et choisis au plus près de leur origine, en respectant leur
            saisonnalité.
          </Typography>
          <Typography variant="body" tone="secondary">
            Pour Martin, un bon produit n&apos;a pas besoin d&apos;être dénaturé. Quand le goût est là,
            la simplicité reste souvent la meilleure façon de le raconter.
          </Typography>
          <Typography variant="body" tone="secondary">
            Notre carte évolue donc au fil des saisons, environ tous les deux mois, en fonction de
            ce que la nature et nos producteurs ont à nous offrir. Une carte volontairement courte,
            pour cuisiner juste, éviter le gaspillage et laisser toute leur place aux produits.
          </Typography>
        </VStack>

        <VStack spacing="lg">
          <Typography variant="h3" as="h2">Quelques-unes de nos créations</Typography>
          {cuisineImages.length > 0 ? (
            <Grid columns={3} className={styles.cuisineGalleryGrid}>
              {cuisineImages.map((image, index) => (
                <Card key={image.src} variant="image" className={styles.cuisineGalleryCard}>
                  <AppImage
                    src={image.src}
                    alt={image.alt}
                    width={1200}
                    height={index % 5 === 0 ? 1500 : 1200}
                    sizes="(max-width: 47.99rem) 100vw, (max-width: 63.99rem) 50vw, 33vw"
                    variant="card"
                    className={styles.cuisineGalleryImage}
                  />
                </Card>
              ))}
            </Grid>
          ) : null}
        </VStack>
      </VStack>
    </Section>
  );
}

export function GallerySection() {
  return (
    <Section spacing="xl" background="background">
      <VStack spacing="xl">
        <VStack spacing="md" className={styles.sectionHeading}>
          <Badge tone="neutral" variant="outline">
            Galerie
          </Badge>
          <Typography variant="h2" as="h1">L&apos;atmosphere du lieu, capturee dans ses moindres details</Typography>
          <Typography variant="body" tone="secondary">
            Ces photos presentent l&apos;ambiance du restaurant, la terrasse et quelques creations
            culinaires servies selon la saison.
          </Typography>
        </VStack>

        <div className={styles.masonry}>
          {galleryImages.map((src, idx) => (
            <Fade key={`${src}-${idx}`} className={styles.masonryItem}>
              <Card variant="flat" className={styles.galleryCard}>
                <AppImage
                  src={src}
                  alt={`Vue de la galerie ${idx + 1}`}
                  width={1200}
                  height={idx % 3 === 0 ? 1400 : 1000}
                  sizes="(max-width: 47.99rem) 100vw, (max-width: 63.99rem) 50vw, 33vw"
                  variant="rounded"
                  className={styles.galleryImage}
                />
              </Card>
            </Fade>
          ))}
        </div>
      </VStack>
    </Section>
  );
}

export function ReservationSection() {
  return (
    <Section spacing="xl" background="surface">
      <Grid columns={2} className={styles.formGrid}>
        <Surface variant="outline" className={styles.formPanel}>
          <VStack spacing="lg">
            <Typography variant="h3" as="h1">Reservation</Typography>
            <Typography variant="small" tone="secondary">
              Votre demande est transmise directement au restaurant. Le site n&apos;affiche pas de
              systeme d&apos;acceptation ou de refus en ligne.
            </Typography>
            <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
              <label className={styles.fieldLabel} htmlFor="resa-name">
                Nom
              </label>
              <input id="resa-name" name="name" className={styles.field} autoComplete="name" required />

              <label className={styles.fieldLabel} htmlFor="resa-phone">
                Telephone
              </label>
              <input id="resa-phone" name="phone" type="tel" className={styles.field} autoComplete="tel" required />

              <label className={styles.fieldLabel} htmlFor="resa-email">
                Mail
              </label>
              <input id="resa-email" name="email" type="email" className={styles.field} autoComplete="email" required />

              <Flex gap="md" wrap>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="resa-date">
                    Date
                  </label>
                  <input id="resa-date" name="date" type="date" className={styles.field} />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="resa-time">
                    Heure
                  </label>
                  <input id="resa-time" name="time" type="time" className={styles.field} />
                </div>
              </Flex>

              <label className={styles.fieldLabel} htmlFor="resa-guests">
                Nombre de personnes
              </label>
              <input id="resa-guests" name="guests" type="number" min={1} className={styles.field} />

              <label className={styles.fieldLabel} htmlFor="resa-message">
                Message
              </label>
              <textarea id="resa-message" name="message" className={styles.fieldArea} rows={4} />

              <Button variant="primary" size="lg" type="submit">
                Envoyer
              </Button>
            </form>
          </VStack>
        </Surface>

        <Surface variant="filled" className={styles.formAside}>
          <VStack spacing="lg">
            <Typography variant="h3" as="h2">Un accueil attentif, des options sur mesure</Typography>
            <Typography variant="body" tone="secondary">
              Indiquez vos contraintes alimentaires, le nombre de convives et vos preferences.
              Notre equipe prepare chaque accueil avec soin.
            </Typography>
            <AppImage
              src="/images/restaurant/terrasse-02.webp.jpeg"
              alt="Table de terrasse prete dans une ambiance conviviale"
              width={1600}
              height={1200}
              sizes="(max-width: 47.99rem) 100vw, 50vw"
              variant="card"
              className={styles.formAsideImage}
            />
          </VStack>
        </Surface>
      </Grid>
    </Section>
  );
}

export function QuoteSection() {
  return (
    <Section spacing="xl" background="background">
      <Grid columns={2} className={styles.formGrid}>
        <Surface variant="outline" className={styles.formPanel}>
          <VStack spacing="lg">
            <Badge tone="neutral" variant="soft">
              Traiteur
            </Badge>
            <Typography variant="h3" as="h1">Les Minots s&apos;invitent chez vous</Typography>
            <Typography variant="small" tone="secondary">
              Mariage, baptême, anniversaire, dîner privé ou chef à domicile : nous imaginons
              avec vous des prestations sur mesure, au restaurant comme en extérieur.
            </Typography>
            <Typography variant="small" tone="secondary">
              Un événement, une envie, un projet ? Parlons-en.
            </Typography>
            <QuoteRequestForm />
          </VStack>
        </Surface>

        <Card variant="section" className={styles.quoteTips}>
          <VStack spacing="md">
            <Typography variant="h4" as="h2">Informations utiles pour votre demande</Typography>
            <Typography variant="small" tone="secondary">
              Date souhaitee, nombre de convives, type de repas, attentes particulieres et
              organisation souhaitee.
            </Typography>
            <Divider />
            <VStack spacing="sm">
              <Badge tone="success" variant="soft">
                Repas de groupe
              </Badge>
              <Typography variant="small" tone="secondary">
                Organisation de repas familiaux, anniversaires ou reunions conviviales.
              </Typography>
              <Badge tone="info" variant="soft">
                Evenements prives
              </Badge>
              <Typography variant="small" tone="secondary">
                Mariages, baptemes, anniversaires ou celebrations sur mesure.
              </Typography>
              <Badge tone="warning" variant="soft">
                Repas d&apos;entreprise
              </Badge>
              <Typography variant="small" tone="secondary">
                Dejeuners professionnels, repas d&apos;equipe ou evenements d&apos;entreprise.
              </Typography>
            </VStack>
          </VStack>
        </Card>
      </Grid>
    </Section>
  );
}

export function ReviewsSection() {
  return (
    <Section spacing="xl" background="surface">
      <VStack spacing="xl">
        <VStack spacing="md" className={styles.sectionHeading}>
          <Badge tone="success" variant="outline">
            Presse & distinctions
          </Badge>
          <Typography variant="h2" as="h1">Ils parlent de nous</Typography>
          <Typography variant="body" tone="secondary">
            Découvrez les articles et distinctions qui mettent en lumière Les Minots de la Garrigue.
          </Typography>
        </VStack>

        <Grid columns={3} className={styles.pressGrid}>
          {pressArticles.map((article, index) => (
            <Card key={`${article.media}-${index}`} variant="interactive" className={styles.pressCard}>
              <VStack spacing="md" className={styles.pressCardInner}>
                <div className={styles.pressMediaMark}>
                  <div
                    className={`${styles.pressMediaLogoWrap} ${
                      article.media === "Guide Michelin"
                        ? styles.pressMediaLogoWrapMichelin
                        : styles.pressMediaLogoWrapGaultMillau
                    }`}
                  >
                    <Image
                      src={article.mediaLogoSrc}
                      alt={article.mediaLogoAlt}
                      width={600}
                      height={180}
                      sizes="(max-width: 47.99rem) 46vw, (max-width: 63.99rem) 30vw, 24vw"
                      className={`${styles.pressMediaLogo} ${
                        article.media === "Gault&Millau" ? styles.pressMediaLogoGaultMillau : ""
                      }`}
                    />
                  </div>
                </div>

                <VStack spacing="xs">
                  <Typography variant="caption" tone="secondary" className={styles.pressMediaName}>
                    {article.media}
                  </Typography>
                  <Typography variant="h4" as="h3">{article.title}</Typography>
                </VStack>

                <Typography variant="body" tone="secondary" className={styles.pressExcerpt}>
                  {article.excerpt}
                </Typography>

                <Button
                  variant="secondary"
                  size="sm"
                  className={styles.pressButton}
                  onClick={() => {
                    if (article.articleUrl) {
                      window.open(article.articleUrl, "_blank", "noopener,noreferrer");
                    }
                  }}
                >
                  {article.ctaLabel}
                </Button>
              </VStack>
            </Card>
          ))}
        </Grid>
      </VStack>
    </Section>
  );
}

export function ContactSection() {
  return (
    <Section spacing="xl" background="background">
      <Grid columns={2} className={styles.contactGrid}>
        <VStack spacing="lg">
          <Typography variant="h2" as="h1">Contact</Typography>
          <Typography variant="body" tone="secondary">
            Retrouvez toutes nos coordonnees pour nous rendre visite ou nous contacter directement.
          </Typography>

          <VStack spacing="md">
            <Flex gap="sm" align="start">
              <IconWrapper variant="filled" size="md">
                <MapPin size={16} />
              </IconWrapper>
              <a
                href={GOOGLE_MAPS_SHARE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                <Typography variant="body" as="span">
                  {CONTACT_ADDRESS_LINE_1}
                  <br />
                  {CONTACT_ADDRESS_LINE_2}
                </Typography>
              </a>
            </Flex>
            <HStack spacing="sm">
              <IconWrapper variant="filled" size="md">
                <Phone size={16} />
              </IconWrapper>
              <a href={CONTACT_PHONE_HREF} className={styles.contactLink}>
                <Typography variant="body" as="span">
                  {CONTACT_PHONE_DISPLAY}
                </Typography>
              </a>
            </HStack>
            <HStack spacing="sm">
              <IconWrapper variant="filled" size="md">
                <Mail size={16} />
              </IconWrapper>
              <a href={`mailto:${CONTACT_EMAIL}`} className={styles.contactLink}>
                <Typography variant="body" as="span">
                  {CONTACT_EMAIL}
                </Typography>
              </a>
            </HStack>
            <Flex gap="sm" align="start">
              <IconWrapper variant="filled" size="md">
                <Clock3 size={16} />
              </IconWrapper>
              <VStack spacing="xs" className={styles.hoursList}>
                {restaurantHours.map((entry) => (
                  <Flex key={entry.day} justify="between" gap="md" className={styles.hoursRow}>
                    <Typography variant="body">{entry.day}</Typography>
                    <Typography variant="body" tone={entry.time === "Fermé" ? "secondary" : "primary"}>
                      {entry.time}
                    </Typography>
                  </Flex>
                ))}
              </VStack>
            </Flex>
          </VStack>
        </VStack>

        <Surface variant="outline" className={styles.mapPlaceholder}>
          <iframe
            src={GOOGLE_MAPS_EMBED_SRC}
            title="Localisation Les Minots de la Garrigue sur Google Maps"
            className={styles.mapFrame}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href={GOOGLE_MAPS_SHARE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapButtonLink}
          >
            <Button variant="secondary" size="sm">
              Voir sur Google Maps
            </Button>
          </a>
        </Surface>
      </Grid>
    </Section>
  );
}

