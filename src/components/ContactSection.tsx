import { motion } from "framer-motion";
import { Mail, MapPin, Send, Github, Linkedin, Twitter, Phone, Instagram, Radio, Wifi, ShieldCheck, Globe, Database, Terminal, Activity } from "lucide-react";
import { useState } from "react";

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.012 2c-5.508 0-9.988 4.48-9.988 9.988 0 1.764.46 3.42 1.264 4.876L2 22l5.304-1.392c1.404.764 3.012 1.204 4.708 1.204 5.508 0 9.988-4.48 9.988-9.988S17.52 2 12.012 2zm5.7 13.924c-.232.652-1.332 1.224-1.84 1.276-.444.044-1.016.064-1.584-.116-.348-.108-.772-.256-1.316-.488-2.312-.992-3.832-3.344-3.948-3.5-.116-.156-1.024-1.364-1.024-2.6 0-1.236.648-1.844.88-2.096.232-.252.504-.316.672-.316l.448.004c.148 0 .348-.004.5.348.156.364.536 1.308.584 1.404.048.096.08.208.016.336-.064.128-.144.208-.232.312-.088.104-.192.232-.272.312-.1.104-.204.216-.088.412.116.196.516.852 1.108 1.38.76.684 1.4 1 1.6 1.104.2.104.316.088.432-.04.116-.128.5-.584.636-.78.136-.196.272-.164.46-.092.188.072 1.188.56 1.392.664.204.104.34.156.388.244.048.084.048.492-.184 1.144z" />
  </svg>
);

const TelegramIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 1.566 4.802c.188.52.094.726.653.726.431 0 .622-.196.862-.43l2.074-2.016 4.314 3.187c.795.439 1.365.213 1.563-.74l2.834-13.35c.29-1.161-.443-1.69-1.205-1.348z" />
  </svg>
);

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isTransmitting, setIsTransmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmitting(true);
    setTimeout(() => setIsTransmitting(false), 3000);
  };

  const socials = [
    { icon: Github, label: "GitHub", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: WhatsAppIcon, label: "WhatsApp", href: "https://wa.me/917904544330" },
    { icon: TelegramIcon, label: "Telegram", href: "https://t.me/+917904544330" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com/_mr_mkd__" },
  ];

  return (
    <section id="contact" className="relative py-32 overflow-hidden bg-transparent">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header - Telemetry Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-primary/20 pb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="font-mono text-[10px] tracking-[0.4em] text-primary uppercase">Deep Space Network: Established</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.8] mb-4">
              COMS <br />
              <span className="text-primary/40">CHANNEL</span>
            </h2>
            <div className="flex gap-4 font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-6">
              <span className="flex items-center gap-1.5"><Radio size={12} className="text-primary" /> Uplink: Stable</span>
              <span>//</span>
              <span className="flex items-center gap-1.5"><Globe size={12} className="text-primary" /> Region: Earth-Sector-7</span>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-end gap-2 pr-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-1 h-4 bg-primary/${i < 4 ? '60' : '20'} rounded-full`} />
              ))}
            </div>
            <div className="font-mono text-[10px] text-primary/60 uppercase tracking-tighter">Signal Strength: 89%</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Contact Modules Side */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-8 border border-primary/20 bg-card/30 backdrop-blur-md"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/40" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/40" />

              <div className="mb-8">
                <div className="font-mono text-[10px] text-primary mb-1 uppercase tracking-widest flex items-center gap-2">
                  <Database size={12} className="text-primary/40" />
                  Storage Module: BIO_DATA
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground tracking-tight">
                  RECEPTION NODES
                </h3>
              </div>

              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Frequency / Email", value: "manianuram2312@gmail.com", href: "mailto:manianuram2312@gmail.com" },
                  { icon: Phone, label: "Direct Coms / Phone", value: "+91 79045 44330", href: "tel:+917904544330" },
                  { icon: MapPin, label: "Base Station / Location", value: "Valparai, TN, India" },
                ].map((item, idx) => (
                  <div key={idx} className="group flex items-start gap-4 p-4 border border-primary/5 hover:border-primary/20 transition-all">
                    <div className="mt-1 p-2 bg-primary/5 text-primary">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-muted-foreground uppercase mb-1 tracking-tighter">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="text-foreground/90 font-body hover:text-primary transition-colors block leading-none">
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-foreground/90 font-body block leading-none">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Social Relays */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 border border-primary/20 bg-card/30 backdrop-blur-md relative overflow-hidden"
            >
              <div className="font-mono text-[10px] text-primary mb-4 uppercase tracking-widest">Relay Transmitters</div>
              <div className="flex flex-wrap gap-4">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-3 border border-primary/10 hover:border-primary/40 bg-primary/5 text-muted-foreground hover:text-primary transition-all group relative"
                  >
                    <social.icon size={20} className="relative z-10" />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.05] pointer-events-none">
                <Radio size={80} className="text-primary rotate-12" />
              </div>
            </motion.div>
          </div>

          {/* Uplink Form Side */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-10 border border-primary/20 bg-card/40 backdrop-blur-xl group overflow-hidden"
            >
              <div className="absolute inset-0 scanline opacity-[0.02]" />

              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="font-mono text-[10px] text-primary mb-1 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={12} />
                    Encryption: AES-256 ACTIVE
                  </div>
                  <h3 className="font-display text-3xl font-black text-foreground tracking-tight underline decoration-primary/20 underline-offset-8">
                    TRANSMISSION UPLINK
                  </h3>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-mono text-[8px] text-muted-foreground mb-1 uppercase tracking-tighter">Packet Status</div>
                  <div className="flex gap-0.5">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className={`w-3 h-1 ${i < 3 ? 'bg-primary' : 'bg-primary/20'}`} />
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative">
                    <label className="font-mono text-[10px] text-primary/60 mb-2 uppercase tracking-widest block">IDENTIFIER (NAME)</label>
                    <div className="relative">
                      <Terminal size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" />
                      <input
                        type="text"
                        required
                        className="w-full bg-primary/5 border border-primary/10 hover:border-primary/30 focus:border-primary px-10 py-4 font-mono text-sm text-foreground focus:outline-none transition-all placeholder:text-muted-foreground/30"
                        placeholder="ENTER_NAME"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="font-mono text-[10px] text-primary/60 mb-2 uppercase tracking-widest block">COM_ADDR (EMAIL)</label>
                    <div className="relative">
                      <Wifi size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" />
                      <input
                        type="email"
                        required
                        className="w-full bg-primary/5 border border-primary/10 hover:border-primary/30 focus:border-primary px-10 py-4 font-mono text-sm text-foreground focus:outline-none transition-all placeholder:text-muted-foreground/30"
                        placeholder="ENTER_ADDR"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="font-mono text-[10px] text-primary/60 mb-2 uppercase tracking-widest block">DATA_PAYLOAD (MESSAGE)</label>
                  <textarea
                    rows={5}
                    required
                    className="w-full bg-primary/5 border border-primary/10 hover:border-primary/30 focus:border-primary p-6 font-mono text-sm text-foreground focus:outline-none transition-all placeholder:text-muted-foreground/30 resize-none"
                    placeholder="INITIATING_PAYLOAD_ENTRY..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isTransmitting}
                  className="w-full group relative overflow-hidden py-5 bg-primary text-black font-display font-black text-sm tracking-[0.3em] uppercase hover:bg-white transition-all duration-500 disabled:opacity-50"
                >
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {isTransmitting ? (
                      <>
                        <Activity size={18} className="animate-spin" />
                        UPLOADING_DATA...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        START_UPLINK
                      </>
                    )}
                  </div>
                  {/* Glitch Effect on Hover */}
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>
              </form>

              {/* Technical Footnote */}
              <div className="mt-8 flex justify-between items-center opacity-30 select-none pointer-events-none">
                <div className="flex gap-8 font-mono text-[8px] uppercase tracking-tighter">
                  <span>SECURE_LAYER: TLS_1.3</span>
                  <span>TIMESTAMP: {new Date().toISOString().split('T')[1].slice(0, 8)}</span>
                </div>
                <div className="w-12 h-4 border border-primary/40 rounded-sm" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer System Log */}
      <div className="relative z-10 mt-32 border-t border-primary/10 bg-black/40 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <div className="font-display text-xl font-black text-foreground tracking-tighter">
              MANI<span className="text-primary">ANURAM</span>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Port: 3000 // Node: v18.1.0 // Auth: OK
            </div>
          </div>

          <div className="text-center md:text-right">
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
              &copy; 2026 MISSION CONTROL. ALL MODULES OPERATIONAL.
            </div>
            <div className="flex gap-4 justify-center md:justify-end text-primary/40 font-mono text-[8px]">
              <span>[Privacy_Protocol]</span>
              <span>[Terms_of_Service]</span>
              <span>[Debug_Logs]</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scanline {
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(185, 255, 255, 0.05) 50%
          );
          background-size: 100% 4px;
        }
      `}</style>
    </section>
  );
};

export default ContactSection;
