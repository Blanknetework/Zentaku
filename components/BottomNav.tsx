"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { isNavLinkActive } from "@/lib/nav-active";

const items = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/browse?type=anime", label: "Anime", icon: PlayIcon },
  { href: "/browse?type=manga", label: "Manga", icon: BookIcon },
  { href: "/browse?sort=popular", label: "Hot", icon: FireIcon },
  { href: "/forums", label: "Forums", icon: ChatIcon },
];

function BottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/85 backdrop-blur-xl md:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isNavLinkActive(pathname, searchParams, href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 rounded-xl py-1 text-[10px] font-medium transition-smooth ${
                  active ? "text-accent" : "text-muted"
                }`}
              >
                <Icon className="h-5 w-5" active={active} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function BottomNav() {
  return (
    <Suspense fallback={<div className="fixed bottom-0 left-0 right-0 z-50 h-14 border-t border-white/10 bg-black/85 md:hidden" />}>
      <BottomNavInner />
    </Suspense>
  );
}

function HomeIcon({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke={active ? "#ff1a1a" : "currentColor"}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function PlayIcon({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke={active ? "#ff1a1a" : "currentColor"}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function BookIcon({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke={active ? "#ff1a1a" : "currentColor"}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

function FireIcon({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke={active ? "#ff1a1a" : "currentColor"}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
      />
    </svg>
  );
}

function ChatIcon({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke={active ? "#ff1a1a" : "currentColor"}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}
