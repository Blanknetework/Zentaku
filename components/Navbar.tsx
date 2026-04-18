"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { isNavLinkActive } from "@/lib/nav-active";

const links = [
  { href: "/", label: "Home" },
  { href: "/browse?type=anime", label: "Anime" },
  { href: "/browse?type=manga", label: "Manga" },
  { href: "/browse?sort=popular", label: "Popular" },
  { href: "/forums", label: "Forums" },
];

function NavbarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [searchType, setSearchType] = useState("anime");

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.04]">
      <div className="glass absolute inset-0 -z-10 bg-black/60 backdrop-blur-xl" />
      <nav className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 py-3 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center drop-shadow-[0_0_15px_rgba(255,26,26,0.3)] transition-transform hover:scale-105"
          onClick={() => setOpen(false)}
        >
          {/* Must be root-relative: files in `public/` are served from `/`, not `/public/`. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Images/Zentakuu.png"
            alt="Zentaku"
            width={220}
            height={72}
            decoding="async"
            fetchPriority="high"
            className="h-10 w-auto max-w-[min(100%,220px)] object-contain object-left transition-opacity duration-200 group-hover:opacity-100 opacity-95 md:h-11"
          />
        </Link>

        <ul className="hidden items-center gap-1 md:flex tracking-wide">
          {links.map(({ href, label }) => {
            const active = isNavLinkActive(pathname, searchParams, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative rounded-xl px-4 py-2.5 text-sm font-bold uppercase transition-all duration-300 hover:text-white ${
                    active ? "text-white" : "text-white/50"
                  }`}
                >
                  {label}
                  {active && <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-accent rounded-full shadow-[0_0_8px_rgba(255,26,26,0.8)]" />}
                </Link>
              </li>
            );
          })}
        </ul>

        <form
          action="/browse"
          className="ml-auto hidden min-w-0 flex-1 max-w-md items-center gap-2 md:flex"
        >
          <div className="relative flex w-full items-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 focus-within:border-accent/40 focus-within:bg-black/60 focus-within:ring-4 focus-within:ring-accent/10 focus-within:shadow-[0_0_20px_rgba(255,26,26,0.15)] group">
            <select
              name="type"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="appearance-none bg-transparent pl-4 pr-2 py-2.5 text-sm font-semibold text-white/70 outline-none hover:text-white transition-colors cursor-pointer border-none focus:ring-0"
            >
              <option value="anime" className="bg-black text-white">Anime</option>
              <option value="manga" className="bg-black text-white">Manga</option>
            </select>
            <div className="h-4 w-px bg-white/20 mx-1 shrink-0" />
            <input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${searchType}...`}
              className="w-full bg-transparent py-2.5 pl-2 pr-5 text-sm text-white outline-none placeholder:text-white/40"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent">
              <SearchIcon className="h-4 w-4" />
            </span>
          </div>
        </form>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/signup"
            className="rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/30"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_14px_0_rgba(255,26,26,0.39)] transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:shadow-[0_6px_20px_rgba(255,26,26,0.5)]"
          >
            Login
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto rounded-full bg-white/5 p-2.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </nav>

      {open && (
        <div className="absolute top-full left-0 right-0 border-b border-white/10 bg-black/95 px-4 py-6 backdrop-blur-xl md:hidden shadow-2xl animate-fade-up">
          <form action="/browse" className="mb-6 flex gap-2">
            <select
              name="type"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none appearance-none"
            >
              <option value="anime">Anime</option>
              <option value="manga">Manga</option>
            </select>
            <div className="relative w-full">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                <SearchIcon className="h-4 w-4" />
              </span>
              <input
                name="q"
                placeholder={`Search ${searchType}...`}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition-all focus:border-accent/40 focus:bg-white/10"
              />
            </div>
          </form>
          <ul className="flex flex-col gap-2">
            {links.map(({ href, label }) => {
              const active = isNavLinkActive(pathname, searchParams, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                      active ? "bg-accent/10 text-accent" : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/signup"
              className="w-full rounded-full border border-white/10 bg-white/5 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="w-full rounded-full bg-accent py-3.5 text-center text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-red-600"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<NavbarFallbackShell />}>
      <NavbarInner />
    </Suspense>
  );
}


function NavbarFallbackShell() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06]">
      <div className="glass absolute inset-0 -z-10" />
      <nav className="mx-auto flex h-[52px] max-w-[1400px] items-center px-4 md:h-[56px] lg:px-8" />
    </header>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
