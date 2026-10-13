import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import backgroundVideo from "../Background/Modern_nightclub_interior_glidin…_20261011094545.mp4";
import "./Home.css";

const premiumEase = [0.76, 0, 0.24, 1];

const nightScenes = [
  {
    chapter: "ACT I",
    title: "Find your evening",
    copy: "Explore the experiences waiting at Belmarose.",
    action: "Discover evenings",
    path: "/evenings",
  },
  {
    chapter: "ACT II",
    title: "Set the table",
    copy: "Take a look at the menu before the night begins.",
    action: "Explore the menu",
    path: "/menu",
  },
  {
    chapter: "ACT III",
    title: "Make it yours",
    copy: "Discover a setting for your next private occasion.",
    action: "Private events",
    path: "/private-events",
  },
];

function Home() {
  const reducedMotion = useReducedMotion();

  return (
    <main className="home-page" id="home-page">
      <section className="home-hero" id="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero-background" id="home-hero-background" aria-hidden="true">
          <video
            className="home-hero-video"
            autoPlay={!reducedMotion}
            muted
            loop
            playsInline
            preload={reducedMotion ? "none" : "metadata"}
            tabIndex={-1}
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        </div>
        <div className="home-gold-dust" aria-hidden="true">
          {!reducedMotion &&
            Array.from({ length: 30 }, (_, index) => (
              <span
                className="home-gold-dust-particle"
                key={index}
                style={{
                  "--dust-left": `${(index * 37 + 11) % 100}%`,
                  "--dust-top": `${(index * 53 + 7) % 100}%`,
                  "--dust-size": `${1 + (index % 3)}px`,
                  "--dust-duration": `${18 + (index % 9)}s`,
                  "--dust-delay": `${-((index * 7) % 25)}s`,
                  "--dust-opacity": `${0.12 + (index % 4) * 0.05}`,
                }}
              />
            ))}
        </div>
        <div className="home-hero-content" id="home-hero-content">
          <p className="home-hero-kicker" id="home-hero-kicker">
            <span className="home-hero-kicker-rule" id="home-hero-kicker-rule" />
            A PLACE FOR THE EVENING
          </p>
          <h1 className="home-hero-title" id="home-hero-title" aria-label="BELMA ROSE">
            <span className="home-title-line-mask" aria-hidden="true">
              <motion.span
                initial={{ y: reducedMotion ? "0%" : "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: reducedMotion ? 0.01 : 1,
                  ease: premiumEase,
                }}
              >
                BELMA
              </motion.span>
            </span>
            <span className="home-title-line-mask" aria-hidden="true">
              <motion.span
                initial={{ y: reducedMotion ? "0%" : "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: reducedMotion ? 0.01 : 1,
                  delay: reducedMotion ? 0 : 0.15,
                  ease: premiumEase,
                }}
              >
                ROSE<span className="home-hero-title-period" id="home-hero-title-period">.</span>
              </motion.span>
            </span>
          </h1>
          <motion.p
            className="home-hero-tagline"
            id="home-hero-tagline"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.9,
              delay: reducedMotion ? 0 : 1.15,
              ease: premiumEase,
            }}
          >
            The art of the evening.
          </motion.p>
          <motion.div
            className="home-hero-actions"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.9,
              delay: reducedMotion ? 0 : 1.3,
              ease: premiumEase,
            }}
          >
            <Link className="home-booking-link" id="home-booking-link" to="/evenings">
              <span>BOOK YOUR TICKETS</span>
              <span className="home-booking-arrow" id="home-booking-arrow" aria-hidden="true">&#8599;</span>
            </Link>
            <Link className="home-menu-link" id="home-menu-link" to="/menu">
              Explore the menu
              <span aria-hidden="true">&#8594;</span>
            </Link>
          </motion.div>
        </div>
        <div className="home-hero-footer" id="home-hero-footer">
          <span className="home-hero-caption" id="home-hero-caption">A LITTLE MORE THAN EXPECTED</span>
          <a className="home-scroll-link" id="home-scroll-link" href="#home-intro">
            <span className="home-scroll-label" id="home-scroll-label">SCROLL DOWN</span>
            <span className="home-scroll-line" id="home-scroll-line" aria-hidden="true" />
          </a>
          <span className="home-hero-index" id="home-hero-index">BELMAROSE / AFTER DARK</span>
        </div>
      </section>

      <section className="home-scenes-section" aria-labelledby="home-scenes-title">
        <div className="home-scenes-heading">
          <p className="home-scenes-eyebrow">THE BELMAROSE EXPERIENCE</p>
          <h2 className="home-scenes-title" id="home-scenes-title">
            The night unfolds.
          </h2>
          <p className="home-scenes-copy">
            Choose where your evening begins. We’ll take care of the atmosphere.
          </p>
        </div>
        <div className="home-scenes-grid">
          {nightScenes.map((scene, index) => (
            <motion.article
              className={`home-scene-card home-scene-card-${index + 1}`}
              key={scene.chapter}
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: reducedMotion ? 0.01 : 0.7,
                delay: reducedMotion ? 0 : index * 0.12,
                ease: premiumEase,
              }}
            >
              <span className="home-scene-chapter">{scene.chapter}</span>
              <div className="home-scene-content">
                <h3 className="home-scene-title">{scene.title}</h3>
                <p className="home-scene-description">{scene.copy}</p>
                <Link className="home-scene-link" to={scene.path}>
                  {scene.action}
                  <span aria-hidden="true">{"\u2197"}</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <motion.section
        className="home-intro-section"
        id="home-intro"
        initial={reducedMotion ? false : { opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: reducedMotion ? 0.01 : 1,
          ease: premiumEase,
        }}
      >
        <p className="home-intro-eyebrow" id="home-intro-eyebrow">A PLACE FOR THE EVENING</p>
        <h2 className="home-intro-title" id="home-intro-title">Stay for the feeling.</h2>
        <p className="home-intro-copy" id="home-intro-copy">
          Good company, thoughtful details, and a night that takes its time.
          Discover the Belmarose experience.
        </p>
        <Link className="home-intro-link" id="home-intro-link" to="/evenings">
          DISCOVER BELMAROSE <span className="home-intro-link-arrow" id="home-intro-link-arrow" aria-hidden="true">&#8599;</span>
        </Link>
      </motion.section>
    </main>
  );
}

export default Home;
