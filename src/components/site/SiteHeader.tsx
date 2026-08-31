"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button, Container, Flex, HStack, Typography, VStack } from "@/components/ui";
import { cn } from "@/utils/cn";

import { siteNavItems } from "./navigation";
import styles from "@/app/page.module.css";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navbarClassName = useMemo(
    () => cn(styles.navbar, isHomePage && styles.navbarHome, isScrolled && styles.navbarScrolled),
    [isHomePage, isScrolled],
  );

  return (
    <header className={navbarClassName}>
      <Container size="2xl">
        <Flex align="center" justify="end" className={styles.navInner}>
          <nav className={styles.desktopNav} aria-label="Navigation principale">
            <HStack spacing="lg">
              {siteNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(styles.navLink, pathname === item.href && styles.navLinkActive)}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  <Typography variant="small" as="span" className={styles.navLinkLabel}>
                    {item.label}
                  </Typography>
                </Link>
              ))}
            </HStack>
          </nav>

          <Button
            variant="icon"
            size="sm"
            className={styles.mobileToggle}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </Flex>

        <div
          id="mobile-menu"
          className={cn(styles.mobilePanel, mobileOpen && styles.mobilePanelOpen)}
          inert={!mobileOpen}
        >
          <VStack spacing="sm" className={styles.mobileStack}>
            {siteNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(styles.mobileLink, pathname === item.href && styles.mobileLinkActive)}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <Typography variant="body">{item.label}</Typography>
              </Link>
            ))}
          </VStack>
        </div>
      </Container>
    </header>
  );
}
