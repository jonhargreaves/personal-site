import Image from "next/image";
import Head from "next/head";
import React from "react";

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
 h-full w-[600px]"
      >
        <Image src="/logo.svg" alt="JH logo" width={24} height={24} priority />
        <div className="h-8 w-full" />
        <div>
          Hello, I&apos;m <span className="text-white">Jon Hargreaves</span>.
        </div>
        <div className="h-6 w-full" />
        <div>
          I&apos;m a Senior Product Designer at{" "}
          <a
            href="https://www.quicknode.com/"
            target="_blank"
            rel="noreferrer"
            className="w-fit text-white border-b border-white/50 hover:border-white/100 transition ease-in-out"
          >
            QuickNode
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
          . I was previously a founding product design at{" "}
          <a
            href="https://icy.tools/"
            target="_blank"
            rel="noreferrer"
            className="w-fit text-white border-b border-white/50 hover:border-white/100 transition ease-in-out"
          >
            icy.tools
          </a>{" "}
          and{" "}
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
        <div>
          <a
            href="https://abcdinamo.com/"
            target="_blank"
            rel="noreferrer"
            className="w-fit text-white border-b border-white/50 hover:border-white/100 transition ease-in-out"
          >
            Connect
          </a>{" "}
          ·{" "}
          <a
            href="https://www.figma.com/proto/ZWigLGMSDosOK4v2NmpaRp/JH-Case-Studies?page-id=221%3A9911&type=design&node-id=221-17478&viewport=45%2C447%2C0.02&t=FNOlyiRApxZOjurN-1&scaling=contain&mode=design"
            target="_blank"
            rel="noreferrer"
            className="w-fit text-white border-b border-white/50 hover:border-white/100 transition ease-in-out"
          >
            Portfolio
          </a>
        </div>
        <div className="h-6 w-full" />
        <div className="h-6 w-full" />
        <div className="h-6 w-full" />
        <div className="text-white/50 text-xs uppercase tracking-[1px]">
          Projects
        </div>
        <div className="h-2 w-full" />
        <div className="bg-white/25 h-px w-full" />

        <div className="h-6 w-full" />
        <div className="h-6 w-full" />
        <div className="h-6 w-full" />
        <div className="h-6 w-full" />
        <div className="h-6 w-full" />
        <div className="h-6 w-full" />
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
          style.&quot; - Massimo Vignelli
        </div>
        <div className="h-6 w-full" />
        <div className="h-6 w-full" />
        <div className="h-6 w-full" />
        <div className="text-white/50 text-xs uppercase tracking-[1px]">
          Designed & coded by Jon Hargreaves © 2025
        </div>
      </div>
    </main>
  );
}
