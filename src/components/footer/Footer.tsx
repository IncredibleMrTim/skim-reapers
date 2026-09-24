"use client"

import { HiPhone, HiMail, HiLocationMarker } from "react-icons/hi"
import { NAV_LINKS } from "../Navbar"
import Link from "next/link"
import Image from "next/image"
import { LiaInstagram, LiaWhatsapp, LiaGoogle } from "react-icons/lia"

import { FaFacebookF } from "react-icons/fa"
import { Separator } from "../ui/separator"
const chunk = <T,>(items: T[], size: number): T[][] => {
  const groups: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    groups.push(items.slice(i, i + size))
  }
  return groups
}

export const Footer = () => {
  return (
    <div className="px-4 md:px-8  flex flex-col gap-6 md:gap-4 mb-2">
      <Separator variant="linear" className="via-brand-content/50" />
      <div className="flex flex-col md:flex-row w-full md:justify-between gap-6 md:gap-0">
        <div className="flex flex-col md:flex-row w-fit mx-auto md:mx-0 md:w-1/3 md:justify-between gap-1 md:gap-0 text-sm items-start">
          <div className="grid grid-cols-[30px_1fr]">
            <HiPhone className="text-brand-accent shrink-0" size={20} />
            <p>07963 438 199</p>
          </div>
          <div className="grid grid-cols-[30px_1fr]">
            <HiMail className="text-brand-accent shrink-0" size={20} />
            <p>info@skimreapers.co.uk</p>
          </div>
          <div className="grid grid-cols-[30px_1fr]">
            <HiLocationMarker
              className="text-brand-accent shrink-0"
              size={20}
            />
            <div>
              <p>West Yorkshire</p>
              <p className="text-xs">(Working across Yorkshire and beyond)</p>
            </div>
          </div>
        </div>
        <Separator
          orientation="vertical"
          variant="linear"
          className="via-brand-content opacity-35"
        />
        <div className="flex flex-wrap md:flex-nowrap gap-14 md:gap-8 md:px-8 justify-center w-full md:w-1/4">
          {chunk(
            [
              ...NAV_LINKS.slice(2, 3),
              { label: "Services", href: "/services" },
              ...NAV_LINKS.slice(3),
            ],
            3,
          ).map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col text-sm">
              {group.map((link) => (
                <Link href={link.href} key={link.label} className="p-0">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <Separator
          orientation="vertical"
          variant="linear"
          className="via-brand-content opacity-35"
        />

        <div className="flex flex-col md:flex-row w-full md:w-1/3 md:justify-end gap-4">
          <div className="flex flex-col md:flex-row w-full gap-4 md:pl-8 md:justify-end">
            <div className="flex flex-col md:flex-row gap-2 md:gap-8 w-full md:w-1/2 items-center md:justify-end md:self-stretch md:flex-1">
              <div className="flex">FOLLOW US</div>
              <div className="flex gap-2">
                <FaFacebookF
                  size={22}
                  className="border border-brand-content rounded-full p-1"
                />
                <LiaInstagram size={24} />
                <LiaWhatsapp size={24} />
                <LiaGoogle size={24} />
              </div>
            </div>
            <Separator
              orientation="vertical"
              variant="linear"
              className="via-brand-content opacity-35"
            />
            <div className="flex flex-col justify-end items-center">
              <Image
                src="/logo_text.svg"
                alt="Skim Reapers logo"
                width={180}
                height={100}
              />
              <p>PROFESSIONAL CONTRACTORS</p>
            </div>
          </div>
        </div>
      </div>
      <Separator
        className="via-brand-content opacity-15 hidden md:block"
        variant="linear"
      />

      <div className="flex flex-col md:flex-row w-full md:justify-end gap-2 items-center text-sm text-center">
        <div>Privacy Policy</div>
        <Separator orientation="vertical" className="bg-brand-content/30" />
        <div>Terms & Conditions</div>
        <Separator orientation="vertical" className="bg-brand-content/30" />

        <div className="flex gap-2 items-center">
          <Image
            src="/icons/town_square_digital_logo.svg"
            alt="Site developed by Town Square Digital"
            width={24}
            height={24}
          />
          <p>Site by Town Square Digital</p>
        </div>
      </div>
    </div>
  )
}
