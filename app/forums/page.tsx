import Link from "next/link";

export default function ForumsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="font-display text-4xl italic text-white">Forums</h1>
      <p className="mt-4 text-muted">
        Community forums are coming soon. Browse anime and manga in the meantime.
      </p>
      <Link
        href="/browse"
        className="mt-8 inline-flex rounded-xl bg-accent px-8 py-3 text-sm font-bold text-white glow-red hover:bg-red-600"
      >
        Explore catalog
      </Link>
    </main>
  );
}
