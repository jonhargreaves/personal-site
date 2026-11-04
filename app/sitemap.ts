import type { MetadataRoute } from "next";
import { work } from "@/lib/work";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://jonhargreaves.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...work.map((study) => ({
      url: `https://jonhargreaves.com${study.href}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
