import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Remove heroBg image, let the ParallaxSpaceBackground shine through completely */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Subtle grid pattern for sci-fi UI feel */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 mix-blend-overlay" />
        {/* Gradient only at the very bottom to blend into the next section smoothly */}
        <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-b from-transparent to-[#020204]" />
      </div>

      {/* Cinematic Scanline effect */}
      <div className="absolute inset-0 scanline opacity-30 mix-blend-overlay pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-left mt-12 md:mt-20 w-full">
        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-3 glass-panel border border-cyan-500/30 shadow-[0_0_15px_rgba(56,189,248,0.2)] rounded-full px-6 py-2 mb-8 backdrop-blur-md"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,1)]" />
          <span className="font-mono text-[10px] md:text-xs text-cyan-300 tracking-[0.3em]">
            ORBITAL STATUS: NOMINAL
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 drop-shadow-2xl"
        >
          <span className="text-white/90 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">CREATIVE</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_30px_rgba(56,189,248,0.4)]">
            ENGINEER
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
          className="font-body text-lg md:text-xl text-blue-100/70 max-w-2xl mb-12 tracking-wide font-light"
        >
          Designing deep-space digital experiences. 
          Specializing in React, TypeScript, and modern web architectures.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col sm:flex-row gap-6 justify-start items-center"
        >
          <a
            href="#projects"
            className="group relative px-8 py-3 rounded font-display text-sm tracking-[0.2em] text-white overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen" />
            <span className="relative z-10 font-semibold">INITIATE LAUNCH</span>
          </a>
          <a
            href="#contact"
            className="px-8 py-3 rounded font-display text-sm tracking-[0.2em] text-cyan-200/70 hover:text-cyan-100 transition-all duration-300 border border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-900/20 backdrop-blur-sm"
          >
            ESTABLISH COMMS
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] text-cyan-300/50 uppercase">Descend</span>
          <motion.div
            animate={{ y: [0, 15, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[2px] h-12 bg-gradient-to-b from-cyan-400 to-transparent rounded-full"
          />
        </motion.div>
      </div>

      {/* Sci-Fi Corner decorations */}
      <div className="absolute top-24 left-8 w-16 h-16 border-l-2 border-t-2 border-cyan-500/30 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-24 right-8 w-16 h-16 border-r-2 border-t-2 border-cyan-500/30 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-24 left-8 w-16 h-16 border-l-2 border-b-2 border-cyan-500/30 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-24 right-8 w-16 h-16 border-r-2 border-b-2 border-cyan-500/30 rounded-br-lg pointer-events-none" />
    </section>
  );
};

export default HeroSection;
