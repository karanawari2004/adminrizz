import { useEffect, useState } from "react";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

import Lenis from "lenis";
import { useLocation } from "react-router-dom";

const premiumEase = [0.22, 1, 0.36, 1];

/* =========================================
   SCROLL REVEALS
========================================= */

export function ScrollReveal() {
  useEffect(() => {
    const routeContent = document.getElementById("route-content");
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (!routeContent || motionPreference.matches || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.remove("is-pending");
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      },
    );

    const revealTargets = [
      "main:not(#home-page) > p:not(.evenings-description)",
      "main:not(#home-page) > h1",
      "main:not(#home-page) > a",
      "main form > label",
      "main form > button",
      ".home-scenes-heading > p",
      ".home-scenes-heading > h2",
      "main img",
      "main article:not(.home-scene-card)",
    ].join(", ");

    const managedTargets = new Set();
    const managedImageCards = new Set();

    const clearReveal = (target) => {
      target.removeAttribute("data-scroll-reveal");
      target.classList.remove(
        "scroll-reveal",
        "is-pending",
        "is-revealed",
        "reveal-left",
        "reveal-right",
        "reveal-scale",
        "image-reveal",
      );
      target.style.removeProperty("--scroll-reveal-delay");
    };

    const prepareReveals = () => {
      managedTargets.forEach((target) => {
        if (routeContent.contains(target)) {
          return;
        }
        revealObserver.unobserve(target);
        clearReveal(target);
        managedTargets.delete(target);
      });

      managedImageCards.forEach((card) => {
        if (routeContent.contains(card)) {
          return;
        }

        card.classList.remove("image-hover");
        managedImageCards.delete(card);
      });

      routeContent.querySelectorAll(revealTargets).forEach((target, index) => {
        if (target.hasAttribute("data-scroll-reveal")) {
          return;
        }

        target.classList.add("scroll-reveal");
        target.setAttribute("data-scroll-reveal", "");
        target.style.setProperty(
          "--scroll-reveal-delay",
          `${Math.min(index, 4) * 80}ms`,
        );

        const isEyebrow = Array.from(target.classList).some((name) =>
          name.includes("eyebrow"),
        );

        if (target.matches("h1, h2") || target instanceof HTMLImageElement) {
          target.classList.add("reveal-scale");
        } else if (isEyebrow) {
          target.classList.add("reveal-left");
        } else if (target.matches("main > a, main form > button")) {
          target.classList.add("reveal-right");
        }

        if (target instanceof HTMLImageElement) {
          target.classList.add("image-reveal");

          const imageCard = target.closest("figure, article, a");
          if (imageCard && !imageCard.classList.contains("image-hover")) {
            imageCard.classList.add("image-hover");
            managedImageCards.add(imageCard);
          }
        }

        revealObserver.observe(target);
        target.classList.add("is-pending");
        managedTargets.add(target);
      });

      document.body.classList.add("scroll-reveal-ready");
    };

    prepareReveals();

    const mutationObserver = new MutationObserver(prepareReveals);
    mutationObserver.observe(routeContent, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      revealObserver.disconnect();
      managedTargets.forEach(clearReveal);
      managedImageCards.forEach((card) => card.classList.remove("image-hover"));
      document.body.classList.remove("scroll-reveal-ready");
    };
  }, []);

  return null;
}

/* =========================================
   PAGE TRANSITION
========================================= */

export function PageTransition({ children }) {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className="page-transition"
        initial={{
          opacity: 0,
          y: reducedMotion ? 0 : 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: reducedMotion ? 0 : 20,
        }}
        transition={{
          duration: reducedMotion ? 0.01 : 0.7,
          ease: premiumEase,
          exit: {
            duration: reducedMotion ? 0.01 : 0.3,
            ease: premiumEase,
          },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* =========================================
   REVEAL TEXT
========================================= */

export function RevealText({ text, className, id }) {
  const reducedMotion = useReducedMotion();

  return (
    <span className={className} id={id} aria-label={text}>
      {Array.from(text).map((character, index) => (
        <motion.span
          key={`${character}-${index}`}
          className="reveal-text-character"
          aria-hidden="true"
          initial={{
            opacity: reducedMotion ? 1 : 0,
            filter: reducedMotion ? "blur(0px)" : "blur(12px)",
            y: reducedMotion ? 0 : 20,
          }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
          }}
          transition={{
            duration: reducedMotion ? 0.01 : 0.8,
            delay: reducedMotion ? 0 : index * 0.08,
            ease: premiumEase,
          }}
        >
          {character === " " ? "\u00a0" : character}
        </motion.span>
      ))}
    </span>
  );
}

/* =========================================
   CUSTOM CURSOR
========================================= */

export function CustomCursor() {
  const x = useMotionValue(-20);
  const y = useMotionValue(-20);

  const [isActive, setIsActive] = useState(false);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );

    if (!canHover.matches || reducedMotion) {
      return undefined;
    }

    const moveCursor = (event) => {
      x.set(event.clientX - 3);
      y.set(event.clientY - 3);

      document.body.classList.add("has-custom-cursor");
    };

    const updateTarget = (event) => {
      const target = event.target;

      setIsActive(
        target instanceof Element &&
          Boolean(target.closest("a, button, [role='button']")),
      );
    };

    const clearTarget = (event) => {
      const relatedTarget = event.relatedTarget;

      if (
        relatedTarget instanceof Element &&
        relatedTarget.closest("a, button, [role='button']")
      ) {
        return;
      }

      setIsActive(false);
    };

    window.addEventListener("pointermove", moveCursor, {
      passive: true,
    });

    document.addEventListener("pointerover", updateTarget);
    document.addEventListener("pointerout", clearTarget);

    return () => {
      document.body.classList.remove("has-custom-cursor");

      window.removeEventListener("pointermove", moveCursor);
      document.removeEventListener("pointerover", updateTarget);
      document.removeEventListener("pointerout", clearTarget);
    };
  }, [reducedMotion, x, y]);

  return (
    <motion.span
      className="custom-cursor"
      aria-hidden="true"
      style={{ x, y }}
      animate={{
        scale: isActive ? 3 : 1,
      }}
      transition={{
        duration: reducedMotion ? 0.01 : 0.75,
        ease: premiumEase,
      }}
    />
  );
}

/* =========================================
   GRAIN OVERLAY
========================================= */

export function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />;
}

/* =========================================
   BELMAROSE CINEMATIC PRELOADER
========================================= */

export function Preloader() {
  const reducedMotion = useReducedMotion();

  const [isVisible, setIsVisible] = useState(true);

  const brandName = "BELMAROSE";

  const letterDuration = reducedMotion ? 0.01 : 0.62;
  const letterStagger = reducedMotion ? 0 : 0.11;

  const lastLetterStart = (brandName.length - 1) * letterStagger;

  const lettersFinishAt = lastLetterStart + letterDuration;

  const underlineDelay = reducedMotion
    ? 0
    : Math.max(0.55, lettersFinishAt - 0.3);

  const underlineDuration = reducedMotion ? 0.01 : 0.65;

  const holdDuration = reducedMotion ? 0.05 : 0.45;

  const fadeDuration = reducedMotion ? 0.01 : 0.65;

  const exitDelay =
    lettersFinishAt +
    holdDuration +
    Math.max(0, underlineDelay + underlineDuration - lettersFinishAt);

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    const totalDuration = reducedMotion ? 250 : exitDelay * 1000;

    const timeout = window.setTimeout(() => {
      setIsVisible(false);
    }, totalDuration);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isVisible, reducedMotion, exitDelay, fadeDuration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="preloader"
          role="status"
          aria-label="BELMAROSE"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: fadeDuration,
              ease: premiumEase,
            },
          }}
        >
          <div className="preloader-mark">
            {/* Individual letter animation */}

            <motion.span
              className="preloader-word"
              aria-hidden="true"
              initial={{
                letterSpacing: reducedMotion ? "0.12em" : "0.02em",
                scale: reducedMotion ? 1 : 0.985,
              }}
              animate={{
                letterSpacing: "0.12em",
                scale: 1,
              }}
              transition={{
                duration: reducedMotion ? 0.01 : 1.6,
                ease: premiumEase,
              }}
              exit={{
                opacity: 0,
                y: reducedMotion ? 0 : -8,
                transition: {
                  duration: reducedMotion ? 0.01 : 0.6,
                  ease: premiumEase,
                },
              }}
            >
              {Array.from(brandName).map((character, index) => (
                <motion.span
                  key={`${character}-${index}`}
                  initial={{
                    opacity: reducedMotion ? 1 : 0,
                    filter: reducedMotion ? "blur(0px)" : "blur(12px)",
                    y: reducedMotion ? 0 : 18,
                  }}
                  animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                    y: 0,
                  }}
                  transition={{
                    duration: letterDuration,
                    delay: index * letterStagger,
                    ease: premiumEase,
                  }}
                >
                  {character}
                </motion.span>
              ))}
            </motion.span>

            {/* Champagne-gold underline */}

            <motion.span
              className="preloader-rule"
              aria-hidden="true"
              initial={{
                scaleX: reducedMotion ? 1 : 0,
                opacity: reducedMotion ? 1 : 0,
              }}
              animate={{
                scaleX: 1,
                opacity: 1,
              }}
              transition={{
                duration: underlineDuration,
                delay: underlineDelay,
                ease: premiumEase,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================================
   SMOOTH SCROLL
========================================= */

export function SmoothScroll() {
  useEffect(() => {
    const preference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let lenis;

    const syncScroll = () => {
      lenis?.destroy();
      lenis = undefined;

      if (preference.matches) {
        return;
      }

      lenis = new Lenis({
        autoRaf: true,
        anchors: true,
        duration: 1.1,
        easing: (progress) => 1 - (1 - progress) ** 3,
      });
    };

    syncScroll();

    preference.addEventListener("change", syncScroll);

    return () => {
      preference.removeEventListener("change", syncScroll);
      lenis?.destroy();
    };
  }, []);

  return null;
}