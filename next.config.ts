import type { NextConfig } from 'next';

const basePath = process.env.BASE_PATH || '';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const nextConfig: NextConfig = {
  output: isGitHubPages ? 'export' : undefined,
  typescript: {
    // The Pages bundle contains only the browser application. Cloudflare's
    // worker bindings are type-checked and built by the regular vinext build.
    ignoreBuildErrors: isGitHubPages,
  },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
