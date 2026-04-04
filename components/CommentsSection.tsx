"use client";

import { useState } from "react";

const demoComments = [
  { user: "Yuki", text: "Animation this week was insane. That fight scene!", ago: "2h" },
  { user: "Ren", text: "OST when the moon hits hits different.", ago: "5h" },
  { user: "Mika", text: "Can't wait for next episode. Zentaku UI is clean too.", ago: "1d" },
];

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

      <ul className="space-y-4 pt-2">
        {demoComments.map((c) => (
          <li
            key={c.user + c.ago}
            className="rounded-xl border border-white/[0.06] bg-black/30 px-4 py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-accent">{c.user}</span>
              <span className="text-xs text-muted">{c.ago} ago</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
