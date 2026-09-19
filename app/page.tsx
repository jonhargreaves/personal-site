import Image from "next/image";
import type { ReactNode } from "react";

import Project from "@/components/Project/project";
import PixelEmojiCard from "@/components/PixelEmojiCard/pixel-emoji-card";
import DialogDemo from "@/components/dialog-demo";
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
    details: "2024 · Product Design, Prototyping, Interaction",
    href: "https://www.figma.com/proto/Wi6kqSdzjk7kvVtgnKuXGa/Web?page-id=647%3A2143&node-id=679-9090&p=f&viewport=45%2C127%2C0.06&t=IEbnHoyWNbolbJMz-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=679%3A9090",
  },
  {
    title: "Name Your Frames Figma Plug-in",
    details: "2024-present · Frontend Development, Interaction, Branding",
    href: "https://www.figma.com/community/plugin/1327859070716103519/name-your-frames",
  },
  {
    title: "Essential Icons Library",
    details: "2023-present · Icon Design, Design System, Branding",
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
    <main className="flex justify-center bg-black">
      <div className="flex h-full w-full max-w-[632px] min-w-0 flex-col px-4 pt-4 pb-4 font-mono text-base text-white/75 lg:pt-[72px]">
        <header>
          <Image src="/logo.svg" alt="JH logo" width={24} height={24} priority />
          <div className="h-8" aria-hidden="true" />
          <h1>
            Hello, I&apos;m <span className="text-white">Jon Hargreaves</span>.
          </h1>
          <div className="h-6" aria-hidden="true" />
          <p>
            I love coffee and work remotely in Norfolk, Virginia.
            Currently, I&apos;m the Head of Design at{" "}
            <ExternalLink href="https://hyper.video/">Hyper</ExternalLink>{" "}
            and Founder of{" "}
            <ExternalLink href="https://www.coffeeclubglobal.com/">
              Coffee Club
            </ExternalLink>
            . Previously, I co-founded{" "}
            <ExternalLink href="https://fathom.care/">Fathom</ExternalLink>{" "}
            and designed products for{" "}
            <ExternalLink href="https://www.quicknode.com/">
              QuickNode
            </ExternalLink>
            , <ExternalLink href="https://icy.tools/">icy.tools</ExternalLink>, and{" "}
            <ExternalLink href="https://1393.xyz/blog/we-replaced-rental-brokers-with-software-and-filled-200-vacant-apartments">
              Caretaker
            </ExternalLink>
            .
          </p>
          <div className="h-6" aria-hidden="true" />
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

        <div className="h-[72px]" aria-hidden="true" />

        <section aria-labelledby="projects-heading">
          <h2
            id="projects-heading"
            className="text-xs uppercase tracking-[1px] text-white/50"
          >
            Projects
          </h2>
          <div className="h-2" aria-hidden="true" />
          <div className="h-px bg-white/25" aria-hidden="true" />
          <ul className="-mx-3 flex flex-col items-center gap-2 pt-4">
            {projects.map((project) => (
              <li key={project.title} className="w-full">
                <a
                  className="group flex w-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Project title={project.title} details={project.details} />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="h-[72px]" aria-hidden="true" />

        <section aria-labelledby="colophon-heading">
          <h2
            id="colophon-heading"
            className="text-xs uppercase tracking-[1px] text-white/50"
          >
            Colophon
          </h2>
          <div className="h-2" aria-hidden="true" />
          <div className="h-px bg-white/25" aria-hidden="true" />
          <div className="h-6" aria-hidden="true" />
          <p>
            A very special thanks to my wonderful partner Abby, friends, family,
            and past/present colleagues. The typeface in-use on this website is{" "}
            <ExternalLink href="https://abcdinamo.com/typefaces/diatype">
              Diatype Mono
            </ExternalLink>{" "}
            by <ExternalLink href="https://abcdinamo.com/">Dinamo</ExternalLink>.
          </p>
          <div className="h-6" aria-hidden="true" />
          <blockquote>
            <p>&ldquo;Styles come and go. Good design is a language, not a style.&rdquo;</p>
            <footer>
              <span aria-hidden="true">- </span>
              <cite className="not-italic">Massimo Vignelli</cite>
            </footer>
          </blockquote>
        </section>

        <div className="h-[72px]" aria-hidden="true" />

        <DialogDemo />

        <footer
          className="grid w-full grid-flow-col grid-cols-2 grid-rows-3 gap-2 min-[480px]:grid-flow-row min-[480px]:grid-cols-3 min-[480px]:grid-rows-2 min-[480px]:gap-3"
          aria-label="Pixel emoji cards"
        >
          <PixelEmojiCard sound="smile" src="/pixel-emoji/slight-smile.svg" alt="Smiling face" width={128} height={128} color="red" />
          <PixelEmojiCard sound="heart" src="/pixel-emoji/heart.svg" alt="Heart" width={128} height={112} color="blue" offsetY={4} />
          <PixelEmojiCard sound="hands" src="/pixel-emoji/hands-pressed-together.svg" alt="Hands pressed together" width={128} height={128} color="yellow" />
          <PixelEmojiCard sound="eyes" src="/pixel-emoji/eyes.svg" alt="Eyes" width={128} height={112} color="blue" />
          <PixelEmojiCard sound="ok" src="/pixel-emoji/ok-hand-sign.svg" alt="OK hand sign" width={96} height={128} color="yellow" />
          <PixelEmojiCard sound="fire" src="/pixel-emoji/fire.svg" alt="Fire" width={100} height={128} color="red" />
        </footer>
      </div>
    </main>
  );
}
