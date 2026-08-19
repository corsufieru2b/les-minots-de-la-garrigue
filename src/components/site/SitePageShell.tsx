import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

type SitePageShellProps = {
  children: React.ReactNode;
};

export function SitePageShell({ children }: SitePageShellProps) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
