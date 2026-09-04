import type { NextConfig } from 'next';

const basePath = process.env.BASE_PATH || '';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const nextConfig: NextConfig = {
  output: isGitHubPages ? 'export' : undefined,
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
