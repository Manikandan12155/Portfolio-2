import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 scanline opacity-20" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="inline-flex items-center gap-3 glass-panel rounded-full px-5 py-2 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="font-mono text-xs text-primary/80 tracking-wider">
            SYSTEM STATUS: OPERATIONAL
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-foreground">FULL STACK</span>
          <br />
          <span className="text-gradient-cyber">DEVELOPER</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 tracking-wide"
        >
          Building next-generation digital experiences from the command center.
          Specializing in React, TypeScript, and cloud architecture.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#projects"
            className="glass-panel glass-panel-hover glow-border px-8 py-3 rounded font-display text-sm tracking-widest text-primary hover:text-primary-foreground hover:bg-primary/90 transition-all duration-300"
          >
            VIEW PROJECTS
          </a>
          <a
            href="#contact"
            className="glass-panel glass-panel-hover px-8 py-3 rounded font-display text-sm tracking-widest text-foreground/70 hover:text-foreground transition-all duration-300"
          >
            CONTACT ME
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent"
            />
          </div>
        </motion.div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-20 left-6 w-20 h-20 border-l border-t border-primary/20" />
      <div className="absolute top-20 right-6 w-20 h-20 border-r border-t border-primary/20" />
      <div className="absolute bottom-20 left-6 w-20 h-20 border-l border-b border-primary/20" />
      <div className="absolute bottom-20 right-6 w-20 h-20 border-r border-b border-primary/20" />
    </section>
  );
};

export default HeroSection;
