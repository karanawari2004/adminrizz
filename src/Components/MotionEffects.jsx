
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useLocation } from "react-router-dom";

const premiumEase = [0.22, 1, 0.36, 1];

export function PageTransition({ children }) {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="page-transition"
        initial={{
          opacity: 0,
          y: reducedMotion ? 0 : 24,
          filter: reducedMotion ? "blur(0px)" : "blur(8px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        exit={{
          opacity: 0,
          y: reducedMotion ? 0 : -12,
          filter: reducedMotion ? "blur(0px)" : "blur(4px)",
        }}
        transition={{
          duration: reducedMotion ? 0.01 : 0.65,
          ease: premiumEase,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function Preloader() {
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  const brandName = "RIZZTIX";

  const duration = reducedMotion ? 0.01 : 0.65;
  const stagger = reducedMotion ? 0 : 0.09;

  const lettersFinishAt =
    (brandName.length - 1) * stagger + duration;

  const totalDuration = reducedMotion
    ? 300
    : (lettersFinishAt + 1.1) * 1000;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(false);
    }, totalDuration);

    return () => window.clearTimeout(timer);
  }, [totalDuration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="preloader"
          role="status"
          aria-label="Loading RIZZTIX"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: reducedMotion ? 1 : 1.04,
            filter: reducedMotion ? "blur(0px)" : "blur(10px)",
            transition: {
              duration: reducedMotion ? 0.01 : 0.7,
              ease: premiumEase,
            },
          }}
        >
          {/* Background decoration */}
          <div className="preloader-background">
            <span className="preloader-glow preloader-glow-one" />
            <span className="preloader-glow preloader-glow-two" />
            <span className="preloader-glow preloader-glow-three" />
          </div>

          {/* Main logo section */}
          <div className="preloader-content">
            <motion.div
              className="preloader-orbit"
              initial={{ opacity: 0, scale: 0.7, rotate: -45 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: reducedMotion ? 0 : 315,
              }}
              transition={{
                opacity: { duration: 0.8 },
                scale: { duration: 1, ease: premiumEase },
                rotate: {
                  duration: reducedMotion ? 0.01 : 4,
                  ease: "linear",
                },
              }}
            >
              <span className="preloader-orbit-dot" />
            </motion.div>

            <motion.div
              className="preloader-mark"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reducedMotion ? 0.01 : 0.8,
                ease: premiumEase,
              }}
            >
              <motion.div
                className="preloader-word"
                aria-hidden="true"
                initial={{ letterSpacing: "0.02em" }}
                animate={{ letterSpacing: "0.16em" }}
                transition={{
                  duration: reducedMotion ? 0.01 : 1.2,
                  ease: premiumEase,
                }}
              >
                {Array.from(brandName).map((character, index) => (
                  <motion.span
                    key={`${character}-${index}`}
                    initial={{
                      opacity: reducedMotion ? 1 : 0,
                      y: reducedMotion ? 0 : 25,
                      filter: reducedMotion ? "blur(0px)" : "blur(12px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                    }}
                    transition={{
                      duration,
                      delay: index * stagger,
                      ease: premiumEase,
                    }}
                  >
                    {character}
                  </motion.span>
                ))}
              </motion.div>

              <motion.p
                className="preloader-caption"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0.01 : 0.6,
                  delay: reducedMotion ? 0 : lettersFinishAt,
                  ease: premiumEase,
                }}
              >
                EXPERIENCES THAT STAY WITH YOU
              </motion.p>
            </motion.div>

            {/* Animated loading line */}
            <div className="preloader-progress-track">
              <motion.div
                className="preloader-progress"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: reducedMotion ? 0.01 : 1.8,
                  delay: reducedMotion ? 0 : 0.2,
                  ease: premiumEase,
                }}
              />
            </div>

            <motion.span
              className="preloader-loading-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: reducedMotion ? 0 : 0.5,
              }}
            >
              LOADING EXPERIENCE
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
