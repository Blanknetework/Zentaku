/** Encode AnimeKai / Consumet anime id for use in URL path segments. */
export function animeIdFromParam(param: string) {
  try {
    return decodeURIComponent(param);
  } catch {
    return param;
  }
}

export function animeDetailHref(id: string) {
  return `/anime/${encodeURIComponent(id)}`;
}

export function animeWatchHref(id: string, ep?: number) {
  const base = `/watch/${encodeURIComponent(id)}`;
  return ep != null && Number.isFinite(ep) ? `${base}?ep=${ep}` : base;
}
