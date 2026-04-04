/**
 * Main nav links share `/browse`; only one should look “active” based on query params.
 * Default `/browse` (no query) is treated as anime, matching Jikan browse defaults.
 */
export function isNavLinkActive(
  pathname: string,
  searchParams: URLSearchParams,
  href: string,
): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/forums")) return pathname.startsWith("/forums");

  const [path, queryString] = href.split("?");
  if (path !== pathname) return false;
  if (!queryString) return false;

  const want = new URLSearchParams(queryString);
  const sort = searchParams.get("sort");
  const type = searchParams.get("type");

  if (want.get("sort") === "popular") {
    return sort === "popular";
  }
  if (want.get("type") === "manga") {
    return type === "manga";
  }
  if (want.get("type") === "anime") {
    return type !== "manga" && sort !== "popular";
  }
  return false;
}
