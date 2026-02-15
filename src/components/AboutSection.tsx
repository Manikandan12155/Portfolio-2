import { motion } from "framer-motion";
import profileImg from "@/assets/profile.jpg";

const AboutSection = () => {
  const stats = [
    { value: "5+", label: "Years Experience" },
    { value: "50+", label: "Projects Completed" },
    { value: "30+", label: "Happy Clients" },
    { value: "99%", label: "Success Rate" },
  ];

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-primary/60 tracking-[0.3em]">// ABOUT ME</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">
            <span className="text-gradient-cyber">COMMANDER</span>{" "}
            <span className="text-foreground">PROFILE</span>
          </h2>
          <div className="holographic-line w-32 mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-5 gap-10 items-start">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="relative glass-panel rounded-lg p-1 glow-border">
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-full aspect-square object-cover rounded-md"
                />
                {/* Overlay corners */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-primary/60" />
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-primary/60" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-primary/60" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-primary/60" />
              </div>
              {/* Status */}
              <div className="mt-4 glass-panel rounded px-4 py-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-mono text-xs text-foreground/60">Available for missions</span>
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-3 space-y-6"
          >
            <div className="glass-panel rounded-lg p-6 glow-border">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="font-mono text-xs text-muted-foreground ml-2">bio.md</span>
              </div>
              <p className="font-body text-lg text-foreground/80 leading-relaxed mb-4">
                I'm a passionate full-stack developer with 5+ years of experience crafting
                digital experiences that push boundaries. From responsive web applications
                to scalable cloud architectures, I transform complex challenges into elegant solutions.
              </p>
              <p className="font-body text-lg text-foreground/60 leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies, contributing to
                open-source projects, and mentoring aspiring developers. I believe in clean code,
                continuous learning, and building products that make a difference.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="glass-panel glass-panel-hover rounded-lg p-4 text-center"
                >
                  <div className="font-display text-2xl font-bold text-primary glow-text">{stat.value}</div>
                  <div className="font-mono text-xs text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
