import { motion } from "framer-motion";
import { ExternalLink, Github, Terminal, Activity, Zap, Cpu, Search, Layers } from "lucide-react";
import { useState, useEffect } from "react";

const projects = [
  {
    id: "MOD-01",
    title: "NEBULA DASHBOARD",
    description: "A real-time analytics dashboard with interactive data visualizations, live WebSocket feeds, and AI-powered insights.",
    tags: ["React", "TypeScript", "D3.js", "WebSocket"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    github: "#",
    live: "#",
    status: "STABLE",
    tech: {
      latency: "24ms",
      load: "Low",
      efficiency: "98.2%"
    }
  },
  {
    id: "MOD-02",
    title: "QUANTUM COMMERCE",
    description: "Full-stack e-commerce platform with headless CMS, payment processing, and real-time inventory management.",
    tags: ["Next.js", "Stripe", "PostgreSQL", "Redis"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    github: "#",
    live: "#",
    status: "ACTIVE",
    tech: {
      latency: "42ms",
      load: "Mid",
      efficiency: "94.5%"
    }
  },
  {
    id: "MOD-03",
    title: "ORBITAL CHAT",
    description: "End-to-end encrypted messaging app with video calling, file sharing, and AI-powered smart replies.",
    tags: ["React Native", "Node.js", "WebRTC", "AI"],
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&q=80",
    github: "#",
    live: "#",
    status: "IN ORBIT",
    tech: {
      latency: "12ms",
      load: "High",
      efficiency: "99.8%"
    }
  },
  {
    id: "MOD-04",
    title: "STARDUST CMS",
    description: "Headless content management system with a visual editor, API-first architecture, and multi-language support.",
    tags: ["TypeScript", "GraphQL", "MongoDB", "Docker"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
    github: "#",
    live: "#",
    status: "DEVELOPMENT",
    tech: {
      latency: "N/A",
      load: "Idle",
      efficiency: "87.0%"
    }
  },
];

const ProjectsSection = () => {
  const [throughput, setThroughput] = useState(1.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setThroughput(prev => {
        const change = (Math.random() - 0.5) * 0.1;
        const newVal = prev + change;
        return parseFloat(Math.max(0.8, Math.min(2.5, newVal)).toFixed(2));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="projects" className="relative py-32 overflow-hidden bg-transparent">
      {/* NASA Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute inset-0 bg-space-deep/40 backdrop-blur-[2px]" />

      {/* NASA Inspired Watermark */}
      <div className="absolute top-20 right-[-10%] opacity-[0.03] select-none pointer-events-none rotate-12">
        <svg width="600" height="600" viewBox="0 0 100 100" fill="currentColor" className="text-primary">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <path d="M10 50 Q 50 10 90 50 Q 50 90 10 50" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <text x="50" y="55" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">NASA_CORE</text>
        </svg>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header - Mission Control Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-primary/20 pb-12"
        >
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.4em] text-primary uppercase">Mission Status: Deployment Phase</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.8] mb-4">
              ACTIVE <br />
              <span className="text-primary/40">MODULES</span>
            </h2>
            <div className="flex gap-4 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              <span>System: 0.9.4.2</span>
              <span>//</span>
              <span>Uptime: 99.9%</span>
              <span>//</span>
              <span>Loc: 45.2&deg;N 12.3&deg;E</span>
            </div>
          </div>

          <div className="hidden lg:flex gap-12 items-center">
            <div className="text-right">
              <div className="font-mono text-[10px] text-muted-foreground mb-1 uppercase tracking-tighter">Throughput</div>
              <motion.div
                key={throughput}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="font-display text-2xl font-bold text-primary"
              >
                {throughput} GB/S
              </motion.div>
            </div>
            <div className="h-12 w-[1px] bg-primary/20" />
            <div className="text-right">
              <div className="font-mono text-[10px] text-muted-foreground mb-1 uppercase tracking-tighter">Active Nodes</div>
              <div className="font-display text-2xl font-bold text-primary">04</div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="relative group lg:flex gap-1 border border-primary/20 hover:border-primary/50 bg-card/30 backdrop-blur-sm transition-all duration-500 overflow-hidden"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/40 z-20" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/40 z-20" />

              {/* Module Metadata Sidebar */}
              <div className="w-16 flex-shrink-0 bg-primary/5 border-r border-primary/10 flex flex-col items-center py-6 gap-8 hidden sm:flex">
                <div className="rotate-90 origin-center whitespace-nowrap font-mono text-[10px] tracking-[0.5em] text-primary/40">
                  {project.id}
                </div>
                <div className="flex flex-col gap-4 mt-auto">
                  <Activity size={12} className="text-primary/40" />
                  <Layers size={12} className="text-primary/40" />
                  <Zap size={12} className="text-primary/40" />
                </div>
                <div className="h-12 w-[1px] bg-primary/20" />
              </div>

              {/* Main Content */}
              <div className="flex-grow p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="font-mono text-[10px] text-primary mb-1 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                      Subsystem: {project.status}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors flex items-center gap-2">
                      {project.title}
                      <span className="hidden group-hover:inline-block w-2 h-5 bg-primary animate-pulse" />
                    </h3>
                  </div>
                  <div className="flex gap-4">
                    <a href={project.github} className="p-2 border border-primary/10 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all rounded-sm">
                      <Github size={18} />
                    </a>
                    <a href={project.live} className="p-2 border border-primary/10 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all rounded-sm">
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>

                {/* Subsystem Specs Grid */}
                <div className="grid grid-cols-3 gap-2 mb-6 pointer-events-none">
                  <div className="border border-primary/10 p-2 bg-primary/5">
                    <div className="font-mono text-[8px] text-muted-foreground uppercase">Latency</div>
                    <div className="font-mono text-xs text-primary">{project.tech.latency}</div>
                  </div>
                  <div className="border border-primary/10 p-2 bg-primary/5">
                    <div className="font-mono text-[8px] text-muted-foreground uppercase">Load</div>
                    <div className="font-mono text-xs text-primary">{project.tech.load}</div>
                  </div>
                  <div className="border border-primary/10 p-2 bg-primary/5">
                    <div className="font-mono text-[8px] text-muted-foreground uppercase">Stability</div>
                    <div className="font-mono text-xs text-primary">{project.tech.efficiency}</div>
                  </div>
                </div>

                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8 opacity-80 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2 py-0.5 border border-primary/10 bg-primary/5 text-primary/70 rounded-none uppercase tracking-tighter"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Visual Display Area */}
              <div className="w-full lg:w-48 h-48 lg:h-auto relative overflow-hidden flex-shrink-0 group-hover:grayscale-0 transition-all duration-700">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />

                {/* Visual Overlays */}
                <div className="absolute inset-0 scanline opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-card/50" />

                {/* Crosshair Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-24 h-24 border border-primary/20 rounded-full flex items-center justify-center relative scale-150 group-hover:scale-100 transition-transform">
                    <div className="w-10 h-[1px] bg-primary/40 absolute" />
                    <div className="h-10 w-[1px] bg-primary/40 absolute" />
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 font-mono text-[8px] text-primary/60 bg-black/40 px-1">
                  VIEW_PROJECTION_DATA
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Data Stream */}
        <div className="mt-20 py-4 border-y border-primary/10 overflow-hidden relative">
          <div className="flex gap-20 whitespace-nowrap font-mono text-[10px] text-primary/30 uppercase tracking-[0.5em] animate-marquee">
            <span>[ SYSTEM CHECK OK ]</span>
            <span>[ CORE TEMPERATURE: 32.5&deg;C ]</span>
            <span>[ MEMORY UTILS: 42.1% ]</span>
            <span>[ ENCRYPTION ACTIVE ]</span>
            <span>[ SYSTEM CHECK OK ]</span>
            <span>[ CORE TEMPERATURE: 32.5&deg;C ]</span>
            <span>[ MEMORY UTILS: 42.1% ]</span>
            <span>[ ENCRYPTION ACTIVE ]</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan-slow" />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scan-slow {
          0% { bottom: 100%; opacity: 0; }
          50% { opacity: 0.5; }
          100% { bottom: 0%; opacity: 0; }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-scan-slow {
          animation: scan-slow 10s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default ProjectsSection;
