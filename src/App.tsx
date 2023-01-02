import Logo from './logo.svg';
import './App.css';

const META_TITLE = 'Jon Hargreaves | Design Generalist'
const META_DESCRIPTION = 'Multi-disciplinary designer from Norfolk, VA | Senior Product Designer at QuickNode'
const DEFAULT_KEYWORDS = 'Jon Hargreaves, design, designer, frontend developer, brand systems, design systems, Virginia, Norfolk'
const AUTHOR = 'Jon Hargreaves'

function App() {
  return (
    <div className="app">
      <head>
        <title>{META_TITLE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:title" content={META_TITLE} />
        <meta name="keywords" content={DEFAULT_KEYWORDS} />
        <meta name="author" content={AUTHOR} />
      </head>
      <div className="app-wrapper">
        <div className="app-section__white-divider" />
        <div className="app-section__vertical-spacing" />
        <h1>
          Jon Hargreaves
        </h1>
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <h3>
          Design Generalist
        </h3>
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__yellow-divider" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__row">
          <div className="app-section__yellow-heading">
            <h3>
              Currently
            </h3>
          </div>
          <div className="app-section__horizontal-spacing" />
          <div className="app-section__column">
            <p>
              I'm working remotely as a Senior Product Designer at <a href="https://quicknode.com/" target="_blank" className="app-section__yellow-link">QuickNode</a>. We make blockchain development simple and Web3 is powered by QuickNode.
              <br />
              <br />
              Freelancing status: <span>UNAVAILABLE</span>
              <br />
              <br />
              When I'm not designing, I&#39;m researching fashion trends, collecting modernist furniture, watching Formula 1, getting tattoos, listening to house or jazz music, learning about modernist architecutre, shooting 35mm film, or riding my fixie bike around Norfolk, VA.
            </p>
          </div>
          <div className="app-section__horizontal-spacing" />
        </div>
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__red-divider" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__row">
          <div className="app-section__red-heading">
            <h3>
              Previously
            </h3>
          </div>
          <div className="app-section__horizontal-spacing" />
          <div className="app-section__column">
            <p>
              01/2022 - 05/2022
              <br />
              <a href="https://icy.tools/" target="_blank" className="app-section__red-link">Icy Tools</a>&nbsp;<span>(NFT analytics tools)</span>
              <ul>
                <li>Designed the current logo, marketing pages, & new features throughout the product</li>
                <li>Managed the design system + brand system</li>
                <li>Coded marketing page animations</li>
                <li>Acquired by QuickNode</li>
              </ul>
              <br />
              11/2020 - 01/2022
              <br />
              <a href="https://apartment.app/" target="_blank" className="app-section__red-link">Apartment App</a>&nbsp;<span>(a Caretaker company for renters)</span>
              <ul>
                <li>Designed the current logo, marketing pages, & new features throughout the product</li>
                <li>Managed the design system + brand system</li>
                <li>Coded marketing pages, components, & animations</li>
              </ul>
              <br />
              11/2016 - 01/2022
              <br />
              <a href="https://caretaker.com/" target="_blank" className="app-section__red-link">Caretaker</a>&nbsp;<span>(automated property management suite)</span>
              <ul>
                <li>Designed the current logo, marketing pages, & new features throughout the product</li>
                <li>Managed the design system + brand system</li>
                <li>Coded marketing pages, components, & animations</li>
              </ul>
              <br />
              My career started as a freelance brand designer and illustrator. I was contracted and later hired by Caretaker (previously Flip) as a brand and product designer.
              As time went on, I learned front end development and started maintaining Caretaker's design system. I've realized that I'm a Design Generalist: a designer with many focuses.
            </p>
          </div>
          <div className="app-section__horizontal-spacing" />
        </div>
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__blue-divider" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__row">
          <div className="app-section__blue-heading">
            <h3>
              Looking ahead
            </h3>
          </div>
          <div className="app-section__horizontal-spacing" />
          <div className="app-section__column">
            <p>
              I want to continue learning, mentor up-and-coming designers, and design more than just things that live on the internet. The possiblity of designing homes, furniture, houseware, and clothing is very exciting to me.
              <br />
              <br />
              I would also love to continue growing my collection of modernist furniture, live in a mid century/modern home, find ways to build a more sustainable future with thoughtful design, and make good design accessible to everyone.
              Most of all, I want to explore design the way <a href="https://www.rit.edu/vignellicenter/vignelli-legacy" target="_blank" className="app-section__blue-link">Massimo and Lella Vignelli</a> did.
              <br />
              <br />
              I've never worked in an office and I don't intend to for the entirety of my career as a designer. I believe remote work is the future.
              </p>
          </div>
          <div className="app-section__horizontal-spacing" />
        </div>
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__white-divider" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__row">
          <div className="app-section__white-heading">
            <h3>
              Some links
            </h3>
          </div>
          <div className="app-section__horizontal-spacing" />
          <div className="app-section__column">
            <p>
              If you want to talk, are curious about remote work, or are interested in working together, <a href="mailto:jhargreavesdesigns@gmail.com" target="_blank" className="app-section__white-link">message me</a> and I'll respond to you as soon as I can.
              For recent projects, thoughts I have about design, and insights on remote work go <a href="https://twitter.com/JonGHargreaves" target="_blank" className="app-section__white-link">here</a>.
              <br />
              <br />
              A very special thanks to all of my wonderful friends who have helped me along my journey and to <a href="https://pretendfoundry.com/" target="_blank" className="app-section__white-link">Pretend Foundry</a> for the beautiful typefaces used on this website:
              <ul>
                <li><a href="https://pretendfoundry.com/broad" target="_blank" className="app-section__white-link">Broad Bold</a></li>
                <li><a href="https://pretendfoundry.com/pinopolis" target="_blank" className="app-section__white-link">Pinopolis</a></li>
              </ul>
            </p>
          </div>
          <div className="app-section__horizontal-spacing" />
        </div>
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__white-divider" />
        <div className="app-section__vertical-spacing" />
        <h3>
          "Styles come and go. Good design is a language, not a style."
        </h3>
        <div className="app-section__vertical-spacing" />
        <h2>
          Massimo Vignelli
        </h2>
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <p><span>This website was designed and coded by Jon Hargeaves © 2022</span></p>
        <div className="app-section__vertical-spacing" />
        <img src={Logo} className="app-section__logo" alt="logo" />
      </div>
    </div>
  );
}

export default App;
