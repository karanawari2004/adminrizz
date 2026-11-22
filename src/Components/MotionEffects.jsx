import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

const ease = [0.22, 1, 0.36, 1];

/* Simple page fade between routes */
export function PageTransition({ children }) {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="page-transition"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0.01 : 0.35, ease }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* Simple preloader: logo fades in, thin line fills, then fades out */
export function Preloader() {
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  const totalDuration = reducedMotion ? 300 : 1800;

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), totalDuration);
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
            transition: { duration: reducedMotion ? 0.01 : 0.4, ease },
          }}
        >
          <div className="preloader-content">
            <motion.div
              className="preloader-mark"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.6, ease }}
            >
              <div className="preloader-word" aria-hidden="true">
                RIZZTIX
              </div>

              <p className="preloader-caption">
                EXPERIENCES THAT STAY WITH YOU
              </p>
            </motion.div>

            <div className="preloader-progress-track">
              <motion.div
                className="preloader-progress"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: reducedMotion ? 0.01 : 1.3,
                  delay: reducedMotion ? 0 : 0.2,
                  ease,
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}