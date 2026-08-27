import type { NextConfig } from "next";

/**
 * Baseline security headers applied to every response.
 *
 * A Content-Security-Policy is intentionally omitted: a strict CSP needs
 * per-app tuning (and usually a nonce set in middleware) and a wrong one
 * silently breaks the app. Add one per project once the asset/script
 * origins are known. See docs/adr/0009-security-headers.md.
 */
const securityHeaders = [
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "X-Frame-Options", value: "DENY" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains; preload",
	},
	{ key: "X-DNS-Prefetch-Control", value: "on" },
	{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/**
 * Static export for the showcase, used to publish `/` and `/design-system` to
 * GitHub Pages (see .github/workflows/pages.yml). It's opt-in via STATIC_EXPORT
 * so a plain `pnpm build:showcase` (and any future non-static host) keeps the
 * headers() below working — `output: "export"` produces plain files with no
 * server to apply them, and Next warns/no-ops headers() whenever it's set.
 *
 * GITHUB_PAGES_BASE_PATH is the "/<repo>" prefix a GitHub Pages *project* site
 * serves under (e.g. "/design-system" for kornsour.github.io/design-system);
 * leave unset for a custom domain or a user/org root site.
 */
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.GITHUB_PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
	...(staticExport ? { output: "export" as const, basePath } : {}),
	async headers() {
		return [
			{
				source: "/:path*",
				headers: securityHeaders,
			},
		];
	},
};

export default nextConfig;
