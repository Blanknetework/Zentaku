import Image from "next/image";
import Link from "next/link";
import type { AnimeKaiListItem } from "@/lib/animekai";
import { animeDetailHref, animeWatchHref } from "@/lib/anime-path";
import { streamingPosterUnoptimized } from "@/lib/image-url";

type HeroProps = {
  featured: AnimeKaiListItem | null;
};

export function Hero({ featured }: HeroProps) {
  if (!featured) {
    return (
      <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-surface md:min-h-[480px]">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-deep/40 to-black" />
        <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-end p-6 md:min-h-[480px] md:p-10">
          <h1 className="font-display text-4xl italic text-white md:text-6xl">ZENTAKU</h1>
          <p className="mt-2 max-w-xl text-muted">Stream anime. Read manga. One place.</p>
          <Link
            href="/browse"
            className="mt-6 inline-flex w-fit items-center rounded-xl bg-accent px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-smooth glow-red hover:scale-[1.02] hover:bg-red-600"
          >
            Explore
          </Link>
        </div>
      </div>
    );
  }

  const img = featured.image?.trim() ?? "";
  const title = featured.title;

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-white/10 md:min-h-[480px]">
      {img ? (
        <div className="absolute inset-0 animate-hero-bg">
          <Image
            src={img}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized={streamingPosterUnoptimized(img)}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-deep to-black" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-red-950/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

      <div className="relative z-10 flex min-h-[420px] flex-col justify-end p-8 md:min-h-[550px] md:p-12 lg:max-w-[60%]">
        <p className="animate-fade-up mb-3 w-fit rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-accent backdrop-blur-md border border-accent/30">
          Featured
        </p>
        <h1 className="animate-fade-up-delay font-display text-5xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl drop-shadow-lg">
          {title}
        </h1>
        <p className="animate-fade-up-delay-2 mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-lg">
          Discover top airing series, classics, and fresh episodes — cinematic quality, dark mode
          first.
        </p>
        <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap gap-4">
          <Link
            href={animeWatchHref(featured.id)}
            className="inline-flex items-center justify-center rounded-xl bg-accent px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-all hover:scale-105 hover:bg-red-600 shadow-[0_0_20px_rgba(255,26,26,0.5)]"
          >
            Watch Now
          </Link>
          <Link
            href={animeDetailHref(featured.id)}
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 hover:border-white/50 hover:bg-white/10"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
