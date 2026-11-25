/**
 * Sub-path the site is served under (https://global.expertslive.sa/speakerreg).
 * Read at build time from NEXT_PUBLIC_BASE_PATH. Unset → '/speakerreg'; set it to an empty string
 * to serve from the root (e.g. local development). Imported by next.config.ts, so keep it dependency-free.
 */
export function resolveBasePath(raw: string | undefined): string {
  const value = (raw ?? '/speakerreg').trim().replace(/\/+$/, '');
  if (!value) return '';
  return value.startsWith('/') ? value : `/${value}`;
}

export const basePath = resolveBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

/**
 * Prefixes a root-absolute path ("/logos/x.png") with the base path. Next adds the base path to
 * <Link>, router and redirects by itself, but NOT to next/image string srcs, fetch() or metadata.
 */
export function withBasePath(path: string): string {
  return `${basePath}${path}`;
}
