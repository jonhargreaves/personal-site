import './App.css';

const META_TITLE = 'Jon Hargreaves | Design Generalist'
const META_DESCRIPTION = 'Multi-disciplinary designer from Norfolk, VA | Head of Design at Caretaker'
const DEFAULT_KEYWORDS = 'Jon Hargreaves, designer, frontend developer, Virginia'
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
              What I'm doing
            </h3>
            <div className="app-section__horizontal-spacing" />
          </div>
          <div className="app-section__medium-text-column">
            <p>
              I'm currently working remotely as the Head of Design at <a href="https://caretaker.com/" className="app-section__yellow-link">Caretaker</a>. We are attempting to disrupt the rental housing industry with our property management software.
              <br />
              <br />
              I’m currently not freelancing.
              <br />
              <br />
              When not designing, I’m researching fashion trends, getting tattoos, listening to house or jazz music, reading about mid century/modern furniture and architecutre, shooting 35mm film, or riding my fixie bike.
            </p>
          </div>
        </div>
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__red-divider" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__row">
          <div className="app-section__red-heading">
            <h3>
              What I've done
            </h3>
            <div className="app-section__horizontal-spacing" />
          </div>
          <div className="app-section__medium-text-column">
            <p>
              I've designed, branded, and coded <a href="https://caretaker.com/" className="app-section__red-link">www.caretaker.com</a><br />
              <span>(a product for property owners)</span>
              <br />
              <br />
              I’ve designed, branded, and coded <a href="https://apartment.app/" className="app-section__red-link">www.apartment.app</a><br />
              <span>(a Caretaker company for renters)</span>
              <br />
              <br />
              I started my career as a freelance brand designer and illustrator. I was contracted and later hired by Caretaker (previously Flip) to do brand design, illustration, and product design.
              As time went on I learned front end development and started maintaining Caretaker's design system. I've realized that I'm a Design Generalist: a designer with many focuses.
            </p>
          </div>
        </div>
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__blue-divider" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__row">
          <div className="app-section__blue-heading">
            <h3>
              What I want to do
            </h3>
            <div className="app-section__horizontal-spacing" />
          </div>
          <div className="app-section__medium-text-column">
            <p>
              I'm in the process of starting on a podcast about working remotely as a designer called Designers Drinking Coffee.
              <br />
              <br />
              I would like to collect mid century/modern furniture, buy a mid century house, and design more than just things that live on the internet. The possiblity of designing homes, furniture, houseware, and clothing is exciting to me.
              Most of all, I want to explore design the way <a href="https://www.rit.edu/vignellicenter/vignelli-legacy" className="app-section__blue-link">Massimo and Lella Vignelli</a> did.
              </p>
          </div>
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
            <div className="app-section__horizontal-spacing" />
          </div>
          <div className="app-section__small-text-column">
            <p>
              If you want to talk, <a href="mailto:jhargreavesdesigns@gmail.com" className="app-section__white-link">message me</a> and I'll respond to you as soon as I can.
              For recent projects I’ve worked on, go <a href="https://www.instagram.com/jonhargreaves/?hl=en" className="app-section__white-link">here</a>.
              For rants and thoughts I have about design, go <a href="https://twitter.com/shml_onathan?lang=en" className="app-section__white-link">here</a>.
            </p>
          </div>
          <div className="app-section__horizontal-spacing" />
          <div className="app-section__small-text-column">
            <p>
              A very special thanks to <a href="https://pretendfoundry.com/" className="app-section__white-link">Pretend Foundry</a> for the beautiful typefaces used on this website: Broad Bold and Pinopolis.
            </p>
          </div>
        </div>
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <h3>
          "If you can design one thing, you can design everything."
        </h3>
        <div className="app-section__vertical-spacing" />
        <h2>
          Massimo Vignelli
        </h2>
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <div className="app-section__vertical-spacing" />
        <p>This website was designed and coded by Jon Hargeaves © 2021</p>
      </div>
    </div>
  );
}

export default App;
