import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <h1 className="font-display text-4xl italic text-white">Sign Up</h1>
      <p className="text-sm text-muted">UI placeholder — wire up auth when you are ready.</p>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Display name"
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-accent/40"
        />
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
          Create account
        </button>
      </div>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:text-red-400">
          Login
        </Link>
      </p>
    </main>
  );
}
