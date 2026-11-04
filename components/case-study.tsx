import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import EmojiFooter from "@/components/emoji-footer";
import ProjectList from "@/components/project-list";
import SectionHeading from "@/components/section-heading";
import SiteShell from "@/components/site-shell";
import { work } from "@/lib/work";

function ImagePlaceholder({ caption }: { caption: string }) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="flex aspect-[3/2] items-center justify-center rounded-lg bg-white/5 p-6 outline outline-white/10 -outline-offset-1">
        <span className="text-center text-xs uppercase tracking-[1px] text-white/50">
          Image placeholder
        </span>
      </div>
      <figcaption className="text-xs text-white/50">{caption}</figcaption>
    </figure>
  );
}

export default function CaseStudy({ study }: { study: (typeof work)[number] }) {
  return (
    <SiteShell>
      <header className="flex flex-col gap-6">
        <Link
          href="/#work"
          aria-label="Back to Work"
          className="mb-2 -ml-2 -my-2 flex min-h-11 w-fit items-center gap-2 rounded-lg p-2 text-white/75 transition-[color,background-color,scale] duration-150 hover:bg-white/10 hover:text-white active:scale-[0.96] active:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
          <Image src="/logo.svg" alt="JH logo" width={24} height={24} priority />
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="text-white">{study.title}</h1>
          <p>{study.details}</p>
        </div>
        <p>Case study coming soon.</p>
      </header>

      <ImagePlaceholder caption="Placeholder · Project overview and final designs." />

      <section aria-labelledby="overview-heading" className="flex flex-col gap-6">
        <SectionHeading id="overview-heading">Overview</SectionHeading>
        <p>
          A space to introduce the project, who it was designed for, and the
          problem it set out to solve.
        </p>
        <p>
          Add the project context, my role, and the people I collaborated with.
        </p>
      </section>

      <section aria-labelledby="process-heading" className="flex flex-col gap-6">
        <SectionHeading id="process-heading">Process</SectionHeading>
        <p>
          A space to share the research, explorations, and design decisions that
          shaped the work.
        </p>
        <ImagePlaceholder caption="Placeholder · Explorations, prototypes, and interaction details." />
      </section>

      <section aria-labelledby="outcome-heading" className="flex flex-col gap-6">
        <SectionHeading id="outcome-heading">Outcome</SectionHeading>
        <p>
          A space to share the final experience, what changed, and what I learned
          along the way.
        </p>
      </section>

      <section aria-labelledby="more-work-heading">
        <SectionHeading id="more-work-heading">More Work</SectionHeading>
        <ProjectList items={work.filter((item) => item.slug !== study.slug)} />
      </section>

      <EmojiFooter />
    </SiteShell>
  );
}
