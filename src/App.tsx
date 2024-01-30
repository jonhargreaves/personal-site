import Logo from "./svgs/logo.svg";

const META_TITLE = "Jon Hargreaves | Product Designer";
const META_DESCRIPTION =
  "An adaptive, multidisciplinary product designer focused on identifying and solving problems.";
const DEFAULT_KEYWORDS =
  "Jon Hargreaves, design, designer, product designer, frontend developer, brand systems, design systems, Virginia, Norfolk";
const AUTHOR = "Jon Hargreaves";

function App() {
  return (
    <div className="bg-black flex justify-center">
      <head>
        <title>{META_TITLE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:title" content={META_TITLE} />
        <meta name="keywords" content={DEFAULT_KEYWORDS} />
        <meta name="author" content={AUTHOR} />
      </head>
      <div className="flex flex-col font-mono overflow-hidden px-4 py-4 lg:py-12 text-white h-full w-[1000px]">
        <div className="bg-white h-px w-full" />
        <div className="h-6 w-full lg:h-12" />
        <img src={Logo} className="h-12 w-12" alt="logo" />
        <div className="h-6 w-full lg:h-12" />
        <div className="h-6 w-full lg:h-12" />
        <div className="font-sans text-2xl lg:text-4xl">
          Jon
          <br />
          Hargreaves
        </div>
        <div className="h-6 w-full lg:h-12" />
        <div className="font-sans text-xl lg:text-2xl lg:pr-20">
          <div className="text-gray">
            An adaptive, multidisciplinary product designer focused on
            identifying and solving problems.
          </div>
        </div>
        <div className="h-6 w-full lg:h-12" />
        <div className="h-6 w-full lg:h-12" />
        <div className="h-6 w-full lg:h-12" />
        <div className="bg-yellow h-px w-full" />
        <div className="h-6 w-full lg:h-12" />
        <div className="flex w-full flex-col lg:flex-row">
          <div className="font-bold text-yellow text-sm lg:text-md mb-6 lg:mb-0 tracking-wide w-full lg:w-1/2">
            CURRENTLY
          </div>
          <div className="h-full w-5 lg:w-10" />
          <div className="w-full lg:w-1/2">
            <div className="text-sm lg:text-md">
              I'm currently a Senior Product Designer at{" "}
              <a
                href="https://quicknode.com/"
                target="_blank"
                rel="noreferrer"
                className="border-b border-yellow hover:text-gray"
              >
                QuickNode
              </a>{" "}
              working on the core product and dashboard. I'm also the Founder of{" "}
              <a
                href="https://coffeeclub.net/"
                target="_blank"
                rel="noreferrer"
                className="border-b border-yellow hover:text-gray"
              >
                Coffee Club
              </a>{" "}
              and{" "}
              <a
                href="https://essential.design/"
                target="_blank"
                rel="noreferrer"
                className="border-b border-yellow hover:text-gray"
              >
                Essential Studio
              </a>{" "}
              (WIP).
              <br />
              <br />
              I've never worked in an office and I intend to work remotely for
              my entire design career.
              <br />
              <br />
              When not designing, I&#39;m collecting modernist furniture,
              watching Formula 1, learning to surf, or riding my fixie bike
              around Norfolk, VA.
              <br />
              <br />
              Freelancing status: <span className="text-gray">UNAVAILABLE</span>
            </div>
            <div className="h-6 w-full lg:h-12" />
            <div className="border border-yellow rounded-full px-4 py-1 text-sm mt-3 lg:mt-0 lg:text-md w-fit">
              <a
                href="https://www.figma.com/proto/ZWigLGMSDosOK4v2NmpaRp/JH-Case-Studies?page-id=221%3A9911&type=design&node-id=221-17478&viewport=45%2C447%2C0.02&t=FNOlyiRApxZOjurN-1&scaling=contain&mode=design"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray"
              >
                View case studies ↗
              </a>
            </div>
          </div>
          <div className="h-full w-5 lg:w-10" />
        </div>
        <div className="h-6 w-full lg:h-12" />
        <div className="h-6 w-full lg:h-12" />
        <div className="h-6 w-full lg:h-12" />
        <div className="bg-red h-px w-full" />
        <div className="h-6 w-full lg:h-12" />
        <div className="flex w-full flex-col lg:flex-row">
          <div className="font-bold text-red text-sm lg:text-md mb-6 lg:mb-0 tracking-wide w-full lg:w-1/2">
            PREVIOUSLY
          </div>
          <div className="h-full w-5 lg:w-10" />
          <div className="h-full w-full lg:w-1/2">
            <div className="text-sm lg:text-md">
              <div className="text-gray text-sm lg:text-md">
                01/2022 - 05/2022
              </div>
              Staff Product Designer at{" "}
              <a
                href="https://icy.tools/"
                target="_blank"
                rel="noreferrer"
                className="border-b border-red hover:text-gray"
              >
                icy.tools
              </a>
              <br />
              (acquired by QuickNode)
              <br />
              <br />
              <div className="text-gray text-sm lg:text-md">
                11/2020 - 01/2022
              </div>
              Head of Design at{" "}
              <a
                href="https://apartment.app/"
                target="_blank"
                rel="noreferrer"
                className="border-b border-red hover:text-gray"
              >
                Apartment App
              </a>
              <br />
              (a Caretaker company)
              <br />
              <br />
              <div className="text-gray text-sm lg:text-md">
                07/2017 - 01/2022
              </div>
              Product Designer → Head of Design at{" "}
              <a
                href="https://caretaker.com/"
                target="_blank"
                rel="noreferrer"
                className="border-b border-red hover:text-gray"
              >
                Caretaker
              </a>
              <br />
              (previously Flip)
              <br />
              <br />
              <div className="text-gray text-sm lg:text-md">
                11/2016 - 07/2017
              </div>
              Freelance Visual Designer at Flip
            </div>
          </div>
          <div className="h-full w-5 lg:w-10" />
        </div>
        <div className="h-6 w-full lg:h-12" />
        <div className="h-6 w-full lg:h-12" />
        <div className="h-6 w-full lg:h-12" />
        <div className="bg-blue h-px w-full" />
        <div className="h-6 w-full lg:h-12" />
        <div className="flex w-full flex-col lg:flex-row">
          <div className="font-bold text-blue text-sm lg:text-md mb-6 lg:mb-0 tracking-wide w-full lg:w-1/2">
            LOOKING AHEAD
          </div>
          <div className="h-full w-5 lg:w-10" />
          <div className="w-full lg:w-1/2">
            <div className="text-sm lg:text-md">
              I want to mentor designers, build a more sustainable future with
              thoughtful design, and make good design accessible to everyone.
              Most of all, I want to explore design problems the way{" "}
              <a
                href="https://www.rit.edu/vignellicenter/vignelli-legacy"
                target="_blank"
                rel="noreferrer"
                className="border-b border-blue hover:text-gray"
              >
                Massimo and Lella Vignelli
              </a>{" "}
              did.
              <br />
              <br />
              As a self-taught designer, I would love to learn as much as I can
              about other design disciplines like industrial design and
              architecture. The possibility of designing and building my own
              home, furniture pieces, and houseware is very exciting to me.
              <br />
              <br />
              For an in-depth look at these future ambitions, I did an{" "}
              <a
                href="https://theperfectplay.co/jon-hargreaves-designing-for-humanity/"
                target="_blank"
                rel="noreferrer"
                className="border-b border-blue hover:text-gray"
              >
                an interview
              </a>{" "}
              with The Perfect Play.
            </div>
          </div>
          <div className="h-full w-5 lg:w-10" />
        </div>
        <div className="h-6 w-full lg:h-12" />
        <div className="h-6 w-full lg:h-12" />
        <div className="h-6 w-full lg:h-12" />
        <div className="bg-white h-px w-full" />
        <div className="h-6 w-full lg:h-12" />
        <div className="flex w-full flex-col lg:flex-row">
          <div className="font-bold text-sm lg:text-md mb-6 lg:mb-0 tracking-wide w-full lg:w-1/2">
            SOME LINKS
          </div>
          <div className="h-full w-5 lg:w-10" />
          <div className="w-full lg:w-1/2">
            <div className="text-sm lg:text-md">
              If you'd like to talk or are interested in working together,{" "}
              <a
                href="mailto:hello@jonhargreaves.com"
                target="_blank"
                rel="noreferrer"
                className="border-b border-white hover:text-gray"
              >
                message me
              </a>{" "}
              and I'll respond as soon as I can. For thoughts I have on design,
              follow me on{" "}
              <a
                href="https://www.threads.net/@jonhargreaves"
                target="_blank"
                rel="noreferrer"
                className="border-b border-white hover:text-gray"
              >
                Threads
              </a>{" "}
              and/or&nbsp;
              <a
                href="https://posts.cv/jonhargreaves"
                target="_blank"
                rel="noreferrer"
                className="border-b border-white hover:text-gray"
              >
                Posts.cv
              </a>
              .
              <br />
              <br />A very special thanks to my loving partner Abby, my
              wonderful friends, and my colleages who have supported me during
              my journey. I would also like to thank the fine folks at{" "}
              <a
                href="https://pretendfoundry.com/"
                target="_blank"
                rel="noreferrer"
                className="border-b border-white hover:text-gray"
              >
                Pretend Foundry
              </a>{" "}
              for the beautiful typefaces used on this website:&nbsp;
              <a
                href="https://pretendfoundry.com/broad"
                target="_blank"
                rel="noreferrer"
                className="border-b border-white hover:text-gray"
              >
                Broad Bold
              </a>
              &nbsp;&&nbsp;
              <a
                href="https://pretendfoundry.com/pinopolis"
                target="_blank"
                rel="noreferrer"
                className="border-b border-white hover:text-gray"
              >
                Pinopolis
              </a>
              .
            </div>
          </div>
          <div className="h-full w-5 lg:w-10" />
        </div>
        <div className="h-6 w-full lg:h-12" />
        <div className="h-6 w-full lg:h-12" />
        <div className="h-6 w-full lg:h-12" />
        <div className="bg-white h-px w-full" />
        <div className="h-6 w-full lg:h-12" />
        <div className="font-sans text-xl lg:text-2xl lg:pr-20">
          "Styles come and go. Good design is a language, not a style."
        </div>
        <div className="h-6 w-full lg:h-12" />
        <div className="font-sans text-2xl lg:text-3xl">Massimo Vignelli</div>
        <div className="h-6 w-full lg:h-12" />
        <div className="h-6 w-full lg:h-12" />
        <div className="text-gray text-xs lg:text-sm">
          This website was designed and coded by Jon Hargreaves © 2024
        </div>
      </div>
    </div>
  );
}

export default App;
