import Image from "next/image";
import type { ReactNode } from "react";

import EmojiFooter from "@/components/emoji-footer";
import ProjectList from "@/components/project-list";
import SectionHeading from "@/components/section-heading";
import SiteShell from "@/components/site-shell";
import { work } from "@/lib/work";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const textLinkClass =
  "w-fit border-b border-white/25 text-white transition ease-in-out hover:border-white/50 active:border-white/50 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none";

const projects = [
  {
    title: "Coffee Club Newsletter",
    details: "2024-present · Writing, Branding, Marketing",
    href: "https://www.coffeeclubglobal.com/",
  },
  {
    title: "Coffee Club App Concept",
    details: "2024 · Design System, Prototyping, Interaction",
    href: "https://www.figma.com/proto/Wi6kqSdzjk7kvVtgnKuXGa/Web?page-id=647%3A2143&node-id=679-9090&p=f&viewport=45%2C127%2C0.06&t=IEbnHoyWNbolbJMz-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=679%3A9090",
  },
  {
    title: "Name Your Frames Figma Plug-in",
    details: "2024 · Frontend Development, Interaction, Branding",
    href: "https://www.figma.com/community/plugin/1327859070716103519/name-your-frames",
  },
  {
    title: "Essential Icons Library",
    details: "2023-2024 · Icon Design, Design System, Branding",
    href: "https://www.figma.com/community/file/1218589809425735347",
  },
];

const primaryConnections = [
  { label: "Email", href: "mailto:hello@jonhargreaves.com" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jon-g-hargreaves/",
  },
  { label: "Github", href: "https://github.com/jonhargreaves" },
];

const socialConnections = [
  { label: "Are.na", href: "https://www.are.na/jon-hargreaves" },
  {
    label: "Substack",
    href: "https://substack.com/@jonhargreaves?r=123js1&utm_campaign=profile&utm_medium=profile-page",
  },
  {
    label: "Bluesky",
    href: "https://bsky.app/profile/jonhargreaves.bsky.social",
  },
  { label: "Instagram", href: "https://www.instagram.com/jonhargreaves/" },
  { label: "Threads", href: "https://www.threads.net/@jonhargreaves" },
];

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={textLinkClass}
    >
      {children}
    </a>
  );
}

function ConnectionItem({ label, href }: { label: string; href: string }) {
  const isEmail = href.startsWith("mailto:");

  return (
    <DropdownMenuItem asChild>
      <a
        className="flex w-full"
        href={href}
        target={isEmail ? undefined : "_blank"}
        rel={isEmail ? undefined : "noreferrer"}
      >
        {label}
      </a>
    </DropdownMenuItem>
  );
}

export default function Home() {
  return (
    <SiteShell>
      <header className="flex flex-col gap-6">
        <Image src="/logo.svg" alt="JH logo" width={24} height={24} priority className="mb-2 self-start" />
        <h1>
          Hello, I&apos;m <span className="text-white">Jon Hargreaves</span>.
        </h1>
        <p>
          Currently, I&apos;m looking for my next full-time or contract product
          design role. Previously, I led design at{" "}
          <ExternalLink href="https://hyper.video/">Hyper</ExternalLink>&nbsp;and
          I co-founded{" "}
          <ExternalLink href="https://fathom.care/">Fathom</ExternalLink>. Before
          that, I designed products for{" "}
          <ExternalLink href="https://www.quicknode.com/">
            QuickNode
          </ExternalLink>
          , <ExternalLink href="https://icy.tools/">icy.tools</ExternalLink>, and{" "}
          <ExternalLink href="https://1393.xyz/blog/we-replaced-rental-brokers-with-software-and-filled-200-vacant-apartments">
            Caretaker
          </ExternalLink>
          .
        </p>
        <p>
          I love thoughtful design, coffee brewed by hand, and working remotely
          in Norfolk, Virginia.
        </p>
        <nav aria-label="Personal links" className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-fit cursor-pointer border-b border-white/25 bg-transparent p-0 font-mono text-base text-white transition ease-in-out hover:border-white/50 active:border-white/50 data-[state=open]:border-white/50 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
              >
                Connect
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="font-mono"
              alignOffset={-12}
              side="bottom"
              align="start"
            >
              {primaryConnections.map((connection) => (
                <ConnectionItem key={connection.label} {...connection} />
              ))}
              <DropdownMenuSeparator />
              {socialConnections.map((connection) => (
                <ConnectionItem key={connection.label} {...connection} />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <span aria-hidden="true">&nbsp;·&nbsp;</span>
          <ExternalLink href="https://www.figma.com/proto/ZWigLGMSDosOK4v2NmpaRp/JH-Case-Studies?page-id=221%3A9911&type=design&node-id=221-17478&viewport=-4794%2C301%2C0.21&t=7ygTMcT4tOLzBejn-1&scaling=contain">
            Portfolio
          </ExternalLink>
        </nav>
      </header>

      <section id="work" aria-labelledby="work-heading">
        <SectionHeading id="work-heading">Work</SectionHeading>
        <ProjectList items={work} />
      </section>

      <section aria-labelledby="projects-heading">
        <SectionHeading id="projects-heading">Projects</SectionHeading>
        <ProjectList items={projects} />
      </section>

      <section aria-labelledby="colophon-heading" className="flex flex-col gap-6">
        <SectionHeading id="colophon-heading">Colophon</SectionHeading>
        <p>
          A very special thanks to my wonderful partner Abby, friends, family,
          and past/present colleagues. The typeface in-use on this website is{" "}
          <ExternalLink href="https://abcdinamo.com/typefaces/diatype">
            Diatype Mono
          </ExternalLink>{" "}
          by <ExternalLink href="https://abcdinamo.com/">Dinamo</ExternalLink>.
        </p>
        <blockquote>
          <p>&ldquo;Styles come and go. Good design is a language, not a style.&rdquo;</p>
          <footer>
            <span aria-hidden="true">- </span>
            <cite className="not-italic">Massimo Vignelli</cite>
          </footer>
        </blockquote>
      </section>

      <EmojiFooter />
    </SiteShell>
  );
}
