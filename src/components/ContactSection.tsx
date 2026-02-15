import { motion } from "framer-motion";
import { Mail, MapPin, Send, Github, Linkedin, Twitter, Phone } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder
  };

  const socials = [
    { icon: Github, label: "GitHub", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
  ];

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-primary/60 tracking-[0.3em]">// REACH OUT</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">
            <span className="text-gradient-cyber">OPEN</span>{" "}
            <span className="text-foreground">CHANNEL</span>
          </h2>
          <div className="holographic-line w-32 mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-panel rounded-lg p-6 glow-border">
              <h3 className="font-display text-lg font-bold text-foreground mb-4 tracking-wider">
                TRANSMISSION INFO
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded glass-panel flex items-center justify-center border border-primary/20">
                    <Mail size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">EMAIL</div>
                    <div className="font-body text-sm text-foreground/80">manianuram2312@gmail.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded glass-panel flex items-center justify-center border border-primary/20">
                    <MapPin size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">LOCATION</div>
                    <div className="font-body text-sm text-foreground/80">Valparai, Coimbatore - 642127</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded glass-panel flex items-center justify-center border border-primary/20">
                    <Phone size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">PHONE</div>
                    <div className="font-body text-sm text-foreground/80">7904544330</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-12 h-12 rounded glass-panel glass-panel-hover flex items-center justify-center border border-primary/10 hover:border-primary/40 transition-all text-muted-foreground hover:text-primary"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="glass-panel rounded-lg p-6 glow-border space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="font-mono text-xs text-muted-foreground ml-2">new_message.tsx</span>
              </div>

              <div>
                <label className="font-mono text-xs text-muted-foreground mb-1.5 block">NAME</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-input border border-border/50 rounded px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-muted-foreground mb-1.5 block">EMAIL</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-input border border-border/50 rounded px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-muted-foreground mb-1.5 block">MESSAGE</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full bg-input border border-border/50 rounded px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Write your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full glass-panel glow-border px-6 py-3 rounded font-display text-sm tracking-widest text-primary hover:text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send size={14} />
                TRANSMIT MESSAGE
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-24 border-t border-border/20 pt-8 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">
            © 2026 DEV PORTFOLIO. ALL SYSTEMS OPERATIONAL.
          </span>
          <span className="font-mono text-xs text-muted-foreground/50">
            BUILT WITH REACT + TYPESCRIPT
          </span>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
