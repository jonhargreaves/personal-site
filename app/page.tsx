import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import React from "react";

import Project from "@/components/Project/project";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const META_TITLE = "Jon Hargreaves | Product Designer";
const META_DESCRIPTION =
  "A product designer who builds thoughtful experiences that users love.";
const DEFAULT_KEYWORDS =
  "Jon Hargreaves, design, designer, product designer, frontend developer, branding, design systems, Virginia, Norfolk";
const AUTHOR = "Jon Hargreaves";

export default function Home() {
  return (
    <main className="bg-black flex justify-center">
      <Head>
        <title>{META_TITLE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:title" content={META_TITLE} />
        <meta name="keywords" content={DEFAULT_KEYWORDS} />
        <meta name="author" content={AUTHOR} />
      </Head>
      <div
        className="flex flex-col overflow-hidden px-4 py-4 lg:py-[72px] text-white/75 text-base font-mono
 h-full w-[632px]"
      >
        <Image src="/logo.svg" alt="JH logo" width={24} height={24} priority />
        <div className="h-8 w-full" />
        <div>
          Hello, I&apos;m <span className="text-white">Jon Hargreaves</span>.
        </div>
        <div className="h-6 w-full" />
        <div>
          Currently, I&apos;m the Co-founder & CPO at{" "}
          <a
            href="https://fathom.care/"
            target="_blank"
            rel="noreferrer"
            className="w-fit text-white border-b border-white/50 hover:border-white/100 transition ease-in-out"
          >
            Fathom
          </a>{" "}
          and the Founder of{" "}
          <a
            href="https://www.coffeeclubglobal.com/"
            target="_blank"
            rel="noreferrer"
            className="w-fit text-white border-b border-white/50 hover:border-white/100 transition ease-in-out"
          >
            Coffee Club
          </a>
          . Previously, I was a Product Designer at{" "}
          <a
            href="https://www.quicknode.com/"
            target="_blank"
            rel="noreferrer"
            className="w-fit text-white border-b border-white/50 hover:border-white/100 transition ease-in-out"
          >
            QuickNode
          </a>
          ,{" "}
          <a
            href="https://icy.tools/"
            target="_blank"
            rel="noreferrer"
            className="w-fit text-white border-b border-white/50 hover:border-white/100 transition ease-in-out"
          >
            icy.tools
          </a>
          , and{" "}
          <a
            href="https://caretaker.com/"
            target="_blank"
            rel="noreferrer"
            className="w-fit text-white border-b border-white/50 hover:border-white/100 transition ease-in-out"
          >
            Caretaker
          </a>
          . I love specialty coffee and work remotely in Norfolk, Virginia.
        </div>
        <div className="h-6 w-full" />
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-fit cursor-pointer text-white border-b border-white/50 hover:border-white/100 transition ease-in-out">
                Connect
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="font-mono"
              alignOffset={-12}
              side="bottom"
              align="start"
            >
              <DropdownMenuItem>
                <Link
                  className="flex w-full"
                  href="mailto:hello@jonhargreaves.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Email
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  className="flex w-full"
                  href="https://www.linkedin.com/in/jon-g-hargreaves/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  className="flex w-full"
                  href="https://github.com/jonhargreaves"
                  target="_blank"
                  rel="noreferrer"
                >
                  Github
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  className="flex w-full"
                  href="https://substack.com/@jonhargreaves?r=123js1&utm_campaign=profile&utm_medium=profile-page"
                  target="_blank"
                  rel="noreferrer"
                >
                  Substack
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  className="flex w-full"
                  href="https://bsky.app/profile/jonhargreaves.bsky.social"
                  target="_blank"
                  rel="noreferrer"
                >
                  Bluesky
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  className="flex w-full"
                  href="https://www.instagram.com/jonhargreaves/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  className="flex w-full"
                  href="https://www.threads.net/@jonhargreaves"
                  target="_blank"
                  rel="noreferrer"
                >
                  Threads
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>&nbsp;·&nbsp;</div>
          <a
            href="https://www.figma.com/proto/ZWigLGMSDosOK4v2NmpaRp/JH-Case-Studies?page-id=221%3A9911&type=design&node-id=221-17478&viewport=-4794%2C301%2C0.21&t=7ygTMcT4tOLzBejn-1&scaling=contain"
            target="_blank"
            rel="noreferrer"
            className="w-fit text-white border-b border-white/50 hover:border-white/100 transition ease-in-out"
          >
            Portfolio
          </a>
        </div>
        <div className="h-[72px] w-full" />
        <div className="text-white/50 text-xs uppercase tracking-[1px]">
          Projects
        </div>
        <div className="h-2 w-full" />
        <div className="bg-white/25 h-px w-full" />
        <div className="flex flex-col items-center gap-2 pt-4 -mx-3">
          <Link
            className="flex w-full"
            href="https://www.coffeeclubglobal.com/"
            target="_blank"
            rel="noreferrer"
          >
            <Project>
              <div className="text-white">Coffee Club Newsletter</div>
              <div className="flex">
                2024-present · Writing, Branding, Marketing
              </div>
            </Project>
          </Link>
          <Link
            className="flex w-full"
            href="https://www.figma.com/proto/Wi6kqSdzjk7kvVtgnKuXGa/Web?page-id=647%3A2143&node-id=679-9090&p=f&viewport=45%2C127%2C0.06&t=IEbnHoyWNbolbJMz-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=679%3A9090"
            target="_blank"
            rel="noreferrer"
          >
            <Project>
              <div className="text-white">Coffee Club App Concept</div>
              <div className="flex">
                2024 · Product Design, Prototyping, Interaction
              </div>
            </Project>
          </Link>
          <Link
            className="flex w-full"
            href="https://www.figma.com/community/plugin/1327859070716103519/name-your-frames"
            target="_blank"
            rel="noreferrer"
          >
            <Project>
              <div className="text-white">Name Your Frames Figma Plug-in</div>
              <div className="flex">
                2024-present · Frontend Development, Interaction, Branding
              </div>
            </Project>
          </Link>
          <Link
            className="flex w-full"
            href="https://www.figma.com/community/file/1218589809425735347"
            target="_blank"
            rel="noreferrer"
          >
            <Project>
              <div className="text-white">Essential Icons Library</div>
              <div className="flex">
                2023-present · Icon Design, Design System, Branding
              </div>
            </Project>
          </Link>
        </div>
        <div className="h-[72px] w-full" />
        <div className="text-white/50 text-xs uppercase tracking-[1px]">
          Colophon
        </div>
        <div className="h-2 w-full" />
        <div className="bg-white/25 h-px w-full" />
        <div className="h-6 w-full" />
        <div>
          A very special thanks to my wonderful partner Abby, friends, family,
          and past/present colleagues. The typeface in-use on this website is{" "}
          <a
            href="https://abcdinamo.com/typefaces/diatype"
            target="_blank"
            rel="noreferrer"
            className="w-fit text-white border-b border-white/50 hover:border-white/100 transition ease-in-out"
          >
            Diatype Mono
          </a>{" "}
          by{" "}
          <a
            href="https://abcdinamo.com/"
            target="_blank"
            rel="noreferrer"
            className="w-fit text-white border-b border-white/50 hover:border-white/100 transition ease-in-out"
          >
            Dinamo
          </a>
          .
        </div>
        <div className="h-6 w-full" />
        <div>
          &quot;Styles come and go. Good design is a language, not a
          style.&quot;
        </div>
        <div>- Massimo Vignelli</div>
        <div className="h-[72px] w-full" />
        <div className="text-white/50 text-xs uppercase tracking-[1px]">
          Designed & coded by Jon Hargreaves © 2025
        </div>
      </div>
    </main>
  );
}
