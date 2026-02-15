import { motion, useScroll, useTransform } from "framer-motion";

const ScrollRocket = () => {
  const { scrollYProgress } = useScroll();

  // Rocket moves from top to bottom as user scrolls
  const y = useTransform(scrollYProgress, [0, 1], ["5vh", "75vh"]);
  const rotate = useTransform(scrollYProgress, [0, 0.8, 0.95, 1], [0, 5, 2, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 1], [0, 1, 1]);

  // Flame flicker scale
  const flameScale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [1, 1.2, 0.9, 1.1, 1]
  );

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      style={{ y, rotate, opacity }}
      className="fixed right-6 md:right-10 z-40 cursor-pointer"
      onClick={handleClick}
      title="Back to top"
    >
      <div className="relative flex flex-col items-center">
        {/* Rocket body */}
        <svg
          width="32"
          height="64"
          viewBox="0 0 32 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_12px_hsl(185,100%,50%,0.5)]"
        >
          {/* Nose cone */}
          <path
            d="M16 0 L22 18 H10 Z"
            fill="hsl(185, 80%, 45%)"
            stroke="hsl(185, 100%, 60%)"
            strokeWidth="0.5"
          />
          {/* Body */}
          <rect
            x="10"
            y="18"
            width="12"
            height="28"
            rx="1"
            fill="hsl(220, 25%, 12%)"
            stroke="hsl(185, 60%, 30%)"
            strokeWidth="0.8"
          />
          {/* Window */}
          <circle
            cx="16"
            cy="28"
            r="4"
            fill="hsl(185, 100%, 50%)"
            opacity="0.6"
          />
          <circle
            cx="16"
            cy="28"
            r="2.5"
            fill="hsl(200, 100%, 70%)"
            opacity="0.8"
          />
          {/* Left fin */}
          <path
            d="M10 38 L4 52 L10 46 Z"
            fill="hsl(185, 80%, 40%)"
            stroke="hsl(185, 100%, 55%)"
            strokeWidth="0.5"
          />
          {/* Right fin */}
          <path
            d="M22 38 L28 52 L22 46 Z"
            fill="hsl(185, 80%, 40%)"
            stroke="hsl(185, 100%, 55%)"
            strokeWidth="0.5"
          />
          {/* Bottom */}
          <rect
            x="12"
            y="46"
            width="8"
            height="4"
            fill="hsl(220, 20%, 18%)"
            stroke="hsl(185, 60%, 25%)"
            strokeWidth="0.5"
          />
        </svg>

        {/* Flame */}
        <motion.div
          style={{ scaleY: flameScale }}
          className="flex flex-col items-center -mt-1 origin-top"
        >
          <div className="w-3 h-6 bg-gradient-to-b from-primary via-orange-400 to-transparent rounded-b-full opacity-90 animate-pulse" />
          <div className="w-1.5 h-4 bg-gradient-to-b from-orange-400 to-transparent rounded-b-full opacity-60 -mt-2" />
        </motion.div>

        {/* Trail particles */}
        <div className="flex flex-col items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.4, 0.1, 0.4],
                scale: [1, 0.5, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8 + i * 0.2,
                delay: i * 0.1,
              }}
              className="rounded-full bg-primary/30"
              style={{
                width: `${3 - i * 0.4}px`,
                height: `${3 - i * 0.4}px`,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ScrollRocket;
