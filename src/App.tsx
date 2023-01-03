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
        <img src={Logo} className="app-section__logo" alt="logo" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <h1>
          Jon Hargreaves
        </h1>
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <h3>
          Design Generalist:
          <br />
          <span>A designer with many focuses.</span>
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
              I'm focused on branding, product design, design systems, front end development, and mentoring. I've never worked in an office and I intend to work remotely for my entire design career.
              <br />
              <br />
              I'm working remotely as a Senior Product Designer at <a href="https://quicknode.com/" target="_blank" className="app-section__yellow-link">QuickNode</a>.
              <br />
              <br />
              When I'm not designing, I&#39;m researching fashion trends, collecting modernist furniture, watching Formula 1, listening to jazz, learning about modernist architecutre, shooting 35mm film, or riding my fixie bike around Norfolk, VA.
              <br />
              <br />
              Freelancing status: <span>UNAVAILABLE</span>
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
              <span>01/2022 - 05/2022</span>
              <br />
              Senior Product Designer at <a href="https://icy.tools/" target="_blank" className="app-section__red-link">Icy Tools</a>
              <br />
              <br />
              <span>11/2020 - 01/2022</span>
              <br />
              Head of Design at <a href="https://apartment.app/" target="_blank" className="app-section__red-link">Apartment App</a>
              <br />
              (a Caretaker company)
              <br />
              <br />
              <span>11/2016 - 01/2022</span>
              <br />
              Head of Design at <a href="https://caretaker.com/" target="_blank" className="app-section__red-link">Caretaker</a>
              <br />
              <br />
              My career started as a freelance brand designer and illustrator. I was contracted and later hired by Caretaker (previously Flip) as a brand and product designer.
              As time went on, I learned front end development and started maintaining Caretaker's design system. I realized later that I'm a Design Generalist.
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
              I want to continue learning and design more than things that exist exclusively on the internet. The possiblity of designing homes, furniture, houseware, and clothing is very exciting to me.
              <br />
              <br />
              I would also love to continue growing my collection of modernist furniture, find ways to build a more sustainable future with thoughtful design, and make good design accessible to everyone.
              Most of all, I want to explore design the way <a href="https://www.rit.edu/vignellicenter/vignelli-legacy" target="_blank" className="app-section__blue-link">Massimo and Lella Vignelli</a> did.
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
              A very special thanks to all of my wonderful friends who have helped me along my journey and to <a href="https://pretendfoundry.com/" target="_blank" className="app-section__white-link">Pretend Foundry</a> for the beautiful typefaces used on this website:&nbsp;
              <a href="https://pretendfoundry.com/broad" target="_blank" className="app-section__white-link">Broad Bold</a>&nbsp;&&nbsp;<a href="https://pretendfoundry.com/pinopolis" target="_blank" className="app-section__white-link">Pinopolis</a>.
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
        <p><span>This website was designed and coded by Jon Hargeaves © 2023</span></p>
      </div>
    </div>
  );
}

export default App;
