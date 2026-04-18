"use client";

import { useState } from "react";



export function CommentsSection() {
  const [draft, setDraft] = useState("");

  return (
    <section className="mt-10 space-y-4 rounded-2xl border border-white/10 bg-surface/50 p-6">
      <h2 className="text-lg font-semibold text-foreground">Comments</h2>
      <p className="text-xs text-muted">UI preview — comments are not saved.</p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Share your thoughts..."
          className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition-smooth focus:border-accent/40"
        />
        <button
          type="button"
          className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-smooth hover:bg-red-600"
          onClick={() => setDraft("")}
        >
          Post
        </button>
      </div>

      <div className="pt-2">
        <p className="text-sm text-white/50 italic">No comments yet. Be the first to share your thoughts!</p>
      </div>
    </section>
  );
}
