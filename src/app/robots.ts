import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/workspace/", "/trip/", "/join/", "/auth/"],
    },
    sitemap: "https://voyaq.app/sitemap.xml",
  };
}
