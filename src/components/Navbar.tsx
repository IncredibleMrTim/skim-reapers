"use client"

import { MenuIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
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
  const pathname = usePathname()

  return (
    <header className="flex justify-self-end h-20 light relative w-full lg:w-3/4 lg:pl-20 border-border text-foreground bg-linear-to-r from-brand-background md:from-transparent from-38% md:from-0% via-brand-background via-30% md:via-13% to-100% to-transparent md:to-brand-background">
      <div className="mx-auto flex w-full max-w-[1920px] items-stretch justify-between gap-6 px-4">
        {/* Tagline */}
        <div className="flex justify-center items-center gap-6 border-r border-border py-3 pr-0 md:pr-6 border-none">
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight uppercase">
              Professional Plastering
              <br />& Dry-Lining Contractors
            </p>
            <p className="text-xs font-semibold tracking-[0.15em] text-brand-primary uppercase">
              Commercial & Domestic
            </p>
          </div>
        </div>

        {/* Links */}
        <NavigationMenu className="hidden max-w-none flex-1 lg:flex h-8 my-auto">
          <NavigationMenuList className="h-full items-stretch justify-start gap-1">
            {NAV_LINKS.slice(0, 2).map((link) => {
              const isActive = pathname === link.href
              return (
                <NavigationMenuItem key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`${navLinkClassName} z-20 relative ${
                      isActive
                        ? "after:absolute after:bottom-0 after:left-3 after:h-0.5 after:w-8 after:bg-brand-primary"
                        : ""
                    }`}
                  >
                    {link.label}
                  </a>
                </NavigationMenuItem>
              )
            })}

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
          className="my-auto hidden shrink-0 items-center bg-brand-primary px-8 h-2/4 text-sm font-bold tracking-[0.08em] text-brand-primary-foreground uppercase no-underline transition-opacity hover:opacity-90 lg:flex [clip-path:polygon(6%_0,100%_0,94%_100%,0_100%)]"
        >
          Get a Quote&nbsp;→
        </a>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger
            className="relative"
            render={
              <Button
                variant="ghost"
                size="icon"
                className="my-auto ml-auto lg:hidden z-20 md:z-0 text-brand-background"
                aria-label="Open menu"
              />
            }
          >
            <MenuIcon className="size-6" />
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4">
              {NAV_LINKS.slice(0, 2).map((link) => (
                <SheetClose
                  key={link.href}
                  nativeButton={false}
                  render={<a href={link.href} />}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="rounded-md px-3 py-2 text-sm font-semibold tracking-[0.08em] text-foreground uppercase no-underline transition-colors hover:bg-muted hover:text-brand-primary aria-[current=page]:text-brand-primary"
                >
                  {link.label}
                </SheetClose>
              ))}

              <p className="px-3 pt-3 text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                Services
              </p>
              {SERVICE_LINKS.map((service) => (
                <SheetClose
                  key={service.href}
                  nativeButton={false}
                  render={<a href={service.href} />}
                  className="rounded-md px-3 py-2 text-sm font-semibold tracking-[0.05em] text-foreground uppercase no-underline transition-colors hover:bg-muted hover:text-brand-primary"
                >
                  {service.label}
                </SheetClose>
              ))}

              <div className="mt-2 border-t border-border pt-2">
                {NAV_LINKS.slice(2).map((link) => (
                  <SheetClose
                    key={link.href}
                    nativeButton={false}
                    render={<a href={link.href} />}
                    className="block rounded-md px-3 py-2 text-sm font-semibold tracking-[0.08em] text-foreground uppercase no-underline transition-colors hover:bg-muted hover:text-brand-primary"
                  >
                    {link.label}
                  </SheetClose>
                ))}
              </div>
            </nav>
            <div className="p-4 pt-0">
              <SheetClose
                nativeButton={false}
                render={<a href="#contact" />}
                className="flex h-11 items-center justify-center bg-brand-primary text-sm font-bold tracking-[0.08em] text-brand-primary-foreground uppercase no-underline transition-opacity hover:opacity-90 [clip-path:polygon(6%_0,100%_0,94%_100%,0_100%)]"
              >
                Get a Quote&nbsp;→
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
