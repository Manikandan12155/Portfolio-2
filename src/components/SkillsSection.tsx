import { motion } from "framer-motion";

const skills = [
  { name: "React / Next.js", level: 95, category: "Frontend" },
  { name: "TypeScript", level: 90, category: "Frontend" },
  { name: "Tailwind CSS", level: 92, category: "Frontend" },
  { name: "Node.js", level: 88, category: "Backend" },
  { name: "Python", level: 82, category: "Backend" },
  { name: "PostgreSQL", level: 85, category: "Backend" },
  { name: "AWS / Cloud", level: 80, category: "DevOps" },
  { name: "Docker", level: 78, category: "DevOps" },
];

const techStack = [
  "React", "TypeScript", "Next.js", "Node.js", "Python", "PostgreSQL",
  "MongoDB", "Redis", "Docker", "AWS", "GraphQL", "REST APIs",
  "Tailwind", "Framer Motion", "Git", "CI/CD",
];

const SkillsSection = () => {
  return (
    <section id="skills" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-primary/60 tracking-[0.3em]">// CAPABILITIES</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">
            <span className="text-gradient-cyber">SYSTEM</span>{" "}
            <span className="text-foreground">DIAGNOSTICS</span>
          </h2>
          <div className="holographic-line w-32 mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Skill Bars */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-lg p-6 glow-border"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="font-mono text-xs text-muted-foreground ml-2">system_monitor.exe</span>
            </div>
            <div className="space-y-5">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-body text-sm text-foreground/80">{skill.name}</span>
                    <span className="font-mono text-xs text-primary/70">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.08 }}
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, hsl(185 100% 40%), hsl(185 100% 60%))",
                        boxShadow: "0 0 10px hsl(185 100% 50% / 0.4)",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-lg p-6 glow-border"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="font-mono text-xs text-muted-foreground ml-2">tech_stack.json</span>
            </div>
            <div className="font-mono text-sm text-foreground/60 mb-4">
              <span className="text-primary/80">{"{"}</span>
              <br />
              <span className="ml-4 text-primary/60">"technologies"</span>
              <span className="text-foreground/40">: [</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {techStack.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  className="glass-panel glass-panel-hover px-3 py-1.5 rounded text-xs font-mono text-primary/80 border border-primary/10 hover:border-primary/40 transition-all cursor-default"
                >
                  "{tech}"
                </motion.span>
              ))}
            </div>
            <div className="font-mono text-sm text-foreground/40">
              <span className="ml-4">]</span>
              <br />
              <span className="text-primary/80">{"}"}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
