"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const NAV_LINKS = [
  { label: "Home", href: "#home", active: true },
  { label: "About", href: "#about" },
  { label: "Commercial", href: "#commercial" },
  { label: "Domestic", href: "#domestic" },
  { label: "Our Work", href: "#our-work" },
  { label: "Reviews", href: "#reviews" },
  { label: "Q&A", href: "#qa" },
  { label: "Contact", href: "#contact" },
  { label: "Work With Us", href: "#work-with-us" },
]

const SERVICE_LINKS = [
  { label: "Skimming & Rendering", href: "#services-skimming" },
  { label: "Artex Removal", href: "#services-artex" },
  { label: "Dry Lining", href: "#services-dry-lining" },
  { label: "Full Refurbs", href: "#services-refurbs" },
]

const navLinkClassName =
  "flex h-full items-center px-3 text-xs font-semibold tracking-[0.08em] text-foreground uppercase no-underline transition-colors hover:text-brand-primary"

export function Navbar() {
  return (
    <header className="flex justify-self-end h-20 pl-30 light relative w-3/4  border-border text-foreground bg-linear-to-r from-transparent from-0% via-brand-background via-15% to-100% to-brand-background">
      <div className="mx-auto flex w-full max-w-[1920px] items-stretch justify-between gap-6 px-6">
        {/* Tagline */}
        <div className="flex items-center gap-6 border-r border-border py-3 pr-6">
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight uppercase">
              Professional Plastering
              <br />& Dry-Lining Contractors
            </p>
            <p className="text-xs font-semibold tracking-[0.15em] text-brand-primary uppercase">
              Commercial &amp; Domestic
            </p>
          </div>
        </div>

        {/* Links */}
        <NavigationMenu className="hidden max-w-none flex-1 lg:flex h-8 my-auto">
          <NavigationMenuList className="h-full items-stretch justify-start gap-1">
            {NAV_LINKS.slice(0, 2).map((link) => (
              <NavigationMenuItem key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  className={`${navLinkClassName} relative ${
                    link.active
                      ? "after:absolute after:bottom-0 after:left-3 after:h-[2px] after:w-8 after:bg-brand-primary"
                      : ""
                  }`}
                >
                  {link.label}
                </a>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem>
              <NavigationMenuTrigger className=" h-full rounded-none px-3 text-xs font-semibold tracking-[0.08em] text-foreground uppercase hover:bg-transparent hover:text-brand-primary data-open:bg-transparent">
                Services
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-56 list-none gap-1 p-1">
                  {SERVICE_LINKS.map((service) => (
                    <li key={service.href}>
                      <NavigationMenuLink
                        render={<a href={service.href} />}
                        className="text-xs font-semibold tracking-[0.05em] uppercase"
                      >
                        {service.label}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {NAV_LINKS.slice(2).map((link) => (
              <NavigationMenuItem key={link.href}>
                <a href={link.href} className={navLinkClassName}>
                  {link.label}
                </a>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA */}
        <a
          href="#contact"
          className="my-auto shrink-0 items-center bg-brand-primary px-8 h-2/4 text-sm font-bold tracking-[0.08em] text-brand-primary-foreground uppercase no-underline transition-opacity hover:opacity-90 lg:flex [clip-path:polygon(6%_0,100%_0,94%_100%,0_100%)]"
        >
          Get a Quote&nbsp;→
        </a>
      </div>
    </header>
  )
}
