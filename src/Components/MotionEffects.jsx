import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

const ease = [0.22, 1, 0.36, 1];

/* Page transition between routes */
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

/* Black screen preloader with RIZZTIX branding */
export function Preloader() {
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  const totalDuration = reducedMotion ? 300 : 1800;

  useEffect(() => {
    const timer = window.setTimeout(
      () => setIsVisible(false),
      totalDuration
    );

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
            transition: {
              duration: reducedMotion ? 0.01 : 0.4,
              ease,
            },
          }}
        >
          <div className="preloader-content">
            <motion.div
              className="preloader-mark"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: reducedMotion ? 0.01 : 0.7,
                ease,
              }}
            >
              <div className="preloader-word">
                RIZZTIX
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}