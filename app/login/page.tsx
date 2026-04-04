import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <h1 className="font-display text-4xl italic text-white">Login</h1>
      <p className="text-sm text-muted">UI placeholder — connect your auth provider later.</p>
      <div className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-accent/40"
        />
        <input
          type="password"
          placeholder="Password"
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-accent/40"
        />
        <button
          type="button"
          className="rounded-xl bg-accent py-3 text-sm font-bold text-white glow-red hover:bg-red-600"
        >
          Continue
        </button>
      </div>
      <p className="text-center text-sm text-muted">
        No account?{" "}
        <Link href="/signup" className="text-accent hover:text-red-400">
          Sign up
        </Link>
      </p>
    </main>
  );
}
