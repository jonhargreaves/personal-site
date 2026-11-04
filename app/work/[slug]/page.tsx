import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CaseStudy from "@/components/case-study";
import { work } from "@/lib/work";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return work.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = work.find((item) => item.slug === slug);

  if (!study) notFound();

  const title = `${study.title} | Jon Hargreaves`;
  const description = `${study.title} — ${study.details}. Case study coming soon.`;

  return {
    title,
    description,
    alternates: { canonical: study.href },
    openGraph: {
      title,
      description,
      url: study.href,
      siteName: "Jon Hargreaves",
      locale: "en_US",
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const study = work.find((item) => item.slug === slug);

  if (!study) notFound();

  return <CaseStudy study={study} />;
}
