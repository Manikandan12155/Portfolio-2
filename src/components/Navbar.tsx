import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, QrCode } from "lucide-react";

const navItems = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "SKILLS", href: "#skills" },
  { label: "EDUCATION", href: "#education" },
  { label: "PROJECTS", href: "#projects" },
  { label: "CONTACT", href: "#contact" },
];

const Navbar = ({ onHelpClick }: { onHelpClick: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("HOME");
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const navHeight = 100; // Offset to trigger change earlier
      const scrollPos = window.scrollY + navHeight;

      let currentSection = "HOME";

      for (const item of navItems) {
        const section = document.getElementById(item.href.substring(1));
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            currentSection = item.label;
            break;
          }
        }
      }

      if (window.scrollY < 50) {
        currentSection = "HOME";
      }

      setActive(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "glass-panel border-b border-border/30"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#home" className="font-display text-lg font-bold tracking-widest text-primary glow-text">
            {"<DEV />"}
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                id={`nav-${item.label.toLowerCase()}`}
                href={item.href}
                onClick={() => setActive(item.label)}
                className={`font-display text-xs tracking-[0.2em] transition-all duration-300 relative ${active === item.label
                  ? "text-primary glow-text"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {item.label}
                {active === item.label && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-primary"
                    style={{
                      boxShadow: "0 0 10px hsl(185 100% 50% / 0.5)",
                    }}
                  />
                )}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowQRModal(true)}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              title="Mobile Access"
            >
              <QrCode size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-mono hidden sm:inline">MOBILE</span>
            </button>

            <button
              onClick={onHelpClick}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              title="Help & Guide"
            >
              <HelpCircle size={18} className="group-hover:animate-pulse" />
              <span className="text-xs font-mono hidden sm:inline">HELP</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="font-mono text-xs text-primary/70">ONLINE</span>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* QR Modal */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background/95 border border-primary/20 rounded-xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full -mr-10 -mt-10" />
              <h3 className="text-lg font-display font-bold text-foreground mb-2">Mobile Access</h3>
              <p className="text-sm text-muted-foreground mb-6">Scan to continue on your phone</p>

              <div className="p-4 bg-white rounded-xl mb-6 shadow-inner flex items-center justify-center">
                <QrCode size={128} className="text-black/80" strokeWidth={1.5} />
              </div>

              <p className="text-xs text-muted-foreground mb-4">Make sure your devices are on the same network.</p>

              <button
                onClick={() => setShowQRModal(false)}
                className="w-full py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm text-primary-foreground transition-colors font-medium"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
