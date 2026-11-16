import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

const premiumEase = [0.22, 1, 0.36, 1];

export function PageTransition({ children }) {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="page-transition"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
      key={location.pathname}
      transition={{
        duration: reducedMotion ? 0.01 : 0.7,
        ease: premiumEase,
      }}
    >
      {children}
    </motion.div>
  );
}

export function Preloader() {
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const brandName = "RIZZTIX";

  const letterDuration = reducedMotion ? 0.01 : 0.62;
  const letterStagger = reducedMotion ? 0 : 0.11;
  const lettersFinishAt =
    (brandName.length - 1) * letterStagger + letterDuration;
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
    if (!isVisible) return undefined;

    const timeout = window.setTimeout(
      () => setIsVisible(false),
      reducedMotion ? 250 : exitDelay * 1000,
    );

    return () => window.clearTimeout(timeout);
  }, [isVisible, reducedMotion, exitDelay]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          aria-label="RIZZTIX"
          className="preloader"
          exit={{
            opacity: 0,
            transition: { duration: fadeDuration, ease: premiumEase },
          }}
          initial={{ opacity: 1 }}
          role="status"
        >
          <div className="preloader-mark">
            <motion.span
              animate={{ letterSpacing: "0.12em", scale: 1 }}
              aria-hidden="true"
              className="preloader-word"
              exit={{
                opacity: 0,
                y: reducedMotion ? 0 : -8,
                transition: { duration: reducedMotion ? 0.01 : 0.6, ease: premiumEase },
              }}
              initial={{
                letterSpacing: reducedMotion ? "0.12em" : "0.02em",
                scale: reducedMotion ? 1 : 0.985,
              }}
              transition={{
                duration: reducedMotion ? 0.01 : 1.6,
                ease: premiumEase,
              }}
            >
              {Array.from(brandName).map((character, index) => (
                <motion.span
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  initial={{
                    opacity: reducedMotion ? 1 : 0,
                    filter: reducedMotion ? "blur(0px)" : "blur(12px)",
                    y: reducedMotion ? 0 : 18,
                  }}
                  key={`${character}-${index}`}
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
            <motion.span
              animate={{ scaleX: 1, opacity: 1 }}
              aria-hidden="true"
              className="preloader-rule"
              initial={{
                scaleX: reducedMotion ? 1 : 0,
                opacity: reducedMotion ? 1 : 0,
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
