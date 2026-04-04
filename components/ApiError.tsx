import Link from "next/link";

export function ApiError({
  title = "Something went wrong",
  message,
  status,
}: {
  title?: string;
  message: string;
  status?: number;
}) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-center">
      <p className="text-sm font-semibold text-accent">{title}</p>
      {status != null && (
        <p className="mt-1 text-xs text-muted">HTTP {status}</p>
      )}
      <p className="mt-2 text-sm text-muted">{message}</p>
      <Link
        href="/"
        className="mt-4 inline-block rounded-xl border border-white/15 px-4 py-2 text-sm font-medium transition-smooth hover:border-accent/40"
      >
        Back home
      </Link>
    </div>
  );
}
