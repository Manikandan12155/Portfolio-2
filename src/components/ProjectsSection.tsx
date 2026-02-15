import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "NEBULA DASHBOARD",
    description: "A real-time analytics dashboard with interactive data visualizations, live WebSocket feeds, and AI-powered insights.",
    tags: ["React", "TypeScript", "D3.js", "WebSocket"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    github: "#",
    live: "#",
  },
  {
    title: "QUANTUM COMMERCE",
    description: "Full-stack e-commerce platform with headless CMS, payment processing, and real-time inventory management.",
    tags: ["Next.js", "Stripe", "PostgreSQL", "Redis"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    github: "#",
    live: "#",
  },
  {
    title: "ORBITAL CHAT",
    description: "End-to-end encrypted messaging app with video calling, file sharing, and AI-powered smart replies.",
    tags: ["React Native", "Node.js", "WebRTC", "AI"],
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&q=80",
    github: "#",
    live: "#",
  },
  {
    title: "STARDUST CMS",
    description: "Headless content management system with a visual editor, API-first architecture, and multi-language support.",
    tags: ["TypeScript", "GraphQL", "MongoDB", "Docker"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
    github: "#",
    live: "#",
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-primary/60 tracking-[0.3em]">// PORTFOLIO</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">
            <span className="text-gradient-cyber">MISSION</span>{" "}
            <span className="text-foreground">LOG</span>
          </h2>
          <div className="holographic-line w-32 mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass-panel glass-panel-hover rounded-lg overflow-hidden transition-all duration-500"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                {/* Corner markers */}
                <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-primary/40" />
                <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-primary/40" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-lg font-bold text-foreground tracking-wider">
                    {project.title}
                  </h3>
                  <div className="flex gap-3">
                    <a href={project.github} className="text-muted-foreground hover:text-primary transition-colors">
                      <Github size={16} />
                    </a>
                    <a href={project.live} className="text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs px-2 py-1 rounded bg-primary/5 text-primary/70 border border-primary/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
