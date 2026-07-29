import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzerLib from "@next/bundle-analyzer";

const withBundleAnalyzer = withBundleAnalyzerLib({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/icon.svg",
        permanent: true,
      },
    ];
  },
};

const config = withBundleAnalyzer(nextConfig);

export default withSentryConfig(config, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  tunnelRoute: "/monitoring",
  silent: !process.env.CI,
});
