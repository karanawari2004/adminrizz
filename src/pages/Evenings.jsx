import { motion, useReducedMotion } from "framer-motion";
import { RevealText } from "../Components/MotionEffects";
import "./Evenings.css";

function Evenings() {
  const reducedMotion = useReducedMotion();

  return (
    <main className="evenings-page" id="evenings-page">
      <p className="evenings-eyebrow" id="evenings-eyebrow">II | THE BELMAROSE EXPERIENCE</p>
      <h1 className="evenings-title" id="evenings-title">
        <RevealText text="EVENINGS" className="evenings-title-text" />
      </h1>
      <motion.p
        className="evenings-description"
        id="evenings-description"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reducedMotion ? 0.01 : 0.9,
          delay: reducedMotion ? 0 : 1.45,
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        Discover unforgettable evenings at Belmarose.
      </motion.p>
    </main>
  );
}

export default Evenings;