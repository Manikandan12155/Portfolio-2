import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUp, ArrowDownRight, ChevronRight, Check, Home, User, Code, GraduationCap, Briefcase, Mail, MessageSquare } from "lucide-react";

interface HelpOverlayProps {
    onClose: () => void;
}

const HelpOverlay = ({ onClose }: HelpOverlayProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    // Initial mobile check
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            // Force re-measurement on resize
            updateTargetRect();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const desktopSteps = [
        {
            id: "home",
            targetId: "nav-home",
            title: "Home",
            content: "Return to the main hero section.",
            icon: <Home size={20} />,
            placement: "bottom"
        },
        {
            id: "about",
            targetId: "nav-about",
            title: "About Me",
            content: "Learn about my background and passion.",
            icon: <User size={20} />,
            placement: "bottom"
        },
        {
            id: "skills",
            targetId: "nav-skills",
            title: "Skills",
            content: "Explore my tech stack and expertise.",
            icon: <Code size={20} />,
            placement: "bottom"
        },
        {
            id: "education",
            targetId: "nav-education",
            title: "Education",
            content: "My academic qualifications.",
            icon: <GraduationCap size={20} />,
            placement: "bottom"
        },
        {
            id: "projects",
            targetId: "nav-projects",
            title: "Projects",
            content: "Showcase of my recent work.",
            icon: <Briefcase size={20} />,
            placement: "bottom"
        },
        {
            id: "contact",
            targetId: "nav-contact",
            title: "Contact",
            content: "Get in touch for collaborations.",
            icon: <Mail size={20} />,
            placement: "bottom"
        },
        {
            id: "chatbot",
            targetId: "chatbot-toggle-btn",
            title: "AI Assistant",
            content: "Chat with my AI assistant to learn more!",
            icon: <MessageSquare size={20} />,
            placement: "top-left"
        }
    ];

    const mobileSteps = [
        {
            id: "navbar",
            targetId: "nav-home", // Fallback targeting home if generic navbar not easily id-able
            title: "Navigation",
            content: "Use the menu to explore sections.",
            icon: <ArrowUp size={20} />,
            placement: "bottom" // Fallback
        },
        {
            id: "chatbot",
            targetId: "chatbot-toggle-btn",
            title: "AI Assistant",
            content: "Chat with my AI assistant!",
            icon: <MessageSquare size={20} />,
            placement: "top-left"
        }
    ];

    const steps = isMobile ? mobileSteps : desktopSteps;
    const step = steps[currentStep];

    const updateTargetRect = () => {
        const el = document.getElementById(step.targetId);
        // Fallback for mobile navbar if ID not found, maybe just point to top center?
        if (el) {
            setTargetRect(el.getBoundingClientRect());
        } else if (step.id === 'navbar') {
            // Mock rect for top center
            setTargetRect({ left: window.innerWidth / 2, top: 0, width: 0, height: 60, bottom: 60, right: window.innerWidth / 2 } as DOMRect);
        } else {
            setTargetRect(null);
        }
    };

    useLayoutEffect(() => {
        updateTargetRect();
        // Create an observer to track element position changes (e.g. scroll)
        // For simplicity, just timeout or interval? Scroll listener is key.
        const handleScroll = () => requestAnimationFrame(updateTargetRect);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentStep, isMobile]);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onClose();
        }
    };

    // Calculate Position Styles
    const getStyles = () => {
        if (!targetRect) return { tooltip: { opacity: 0 }, arrow: {} };

        const gap = 12;
        const tooltipWidth = 288; // w-72
        const screenPadding = 16;

        if (step.placement === 'bottom') {
            const targetCenter = targetRect.left + (targetRect.width / 2);
            const idealLeft = targetCenter - (tooltipWidth / 2);
            const maxLeft = window.innerWidth - tooltipWidth - screenPadding;
            const constrainedLeft = Math.max(screenPadding, Math.min(maxLeft, idealLeft));
            const arrowOffset = targetCenter - constrainedLeft - (tooltipWidth / 2);

            return {
                tooltip: {
                    top: targetRect.bottom + gap,
                    left: constrainedLeft,
                    transformOrigin: 'top center'
                },
                arrow: {
                    x: arrowOffset
                }
            };
        } else if (step.placement === 'top-left') {
            return {
                tooltip: {
                    bottom: (window.innerHeight - targetRect.top) + gap,
                    right: (window.innerWidth - targetRect.right),
                    transformOrigin: 'bottom right'
                },
                arrow: {}
            };
        }
        return { tooltip: {}, arrow: {} };
    };

    const styles = getStyles();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/10"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50 p-2 hover:bg-white/10 rounded-full"
            >
                <X size={24} />
            </button>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step.id}
                    ref={tooltipRef}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute flex flex-col items-center"
                    style={styles.tooltip as any}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Arrow Indicator based on placement */}
                    {step.placement === 'bottom' && (
                        <div style={{ transform: `translateX(${styles.arrow?.x || 0}px)` }}>
                            <div className="text-primary animate-bounce mb-2">
                                <ArrowUp size={24} />
                            </div>
                        </div>
                    )}

                    <div className="bg-secondary/95 border border-primary/30 p-5 rounded-xl backdrop-blur-md w-72 shadow-[0_0_40px_rgba(0,255,255,0.2)] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />

                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                            <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                {step.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-display font-bold text-base text-primary leading-none mb-1">{step.title}</h3>
                                <div className="text-[10px] font-mono text-primary/60">
                                    STEP {currentStep + 1} / {steps.length}
                                </div>
                            </div>
                        </div>

                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            {step.content}
                        </p>

                        <div className="flex justify-end">
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-bold tracking-wide hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                            >
                                {currentStep === steps.length - 1 ? "FINISH" : "NEXT"}
                                {currentStep === steps.length - 1 ? <Check size={14} /> : <ChevronRight size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Arrow for top-left placement needs to be at bottom right of tooltip */}
                    {step.placement === 'top-left' && (
                        <div className="text-primary animate-bounce mt-2 self-end mr-8">
                            <ArrowDownRight size={24} />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Highlighting target area (Optional Spotlight Effect) */}
            {targetRect && (
                <motion.div
                    layoutId="spotlight"
                    className="absolute border-2 border-primary/50 rounded-lg bg-primary/5 pointer-events-none z-40"
                    initial={false}
                    animate={{
                        top: targetRect.top - 6,
                        left: targetRect.left - 6,
                        width: targetRect.width + 12,
                        height: targetRect.height + 12,
                        opacity: 1
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
                <p className="text-white/30 text-[10px] animate-pulse font-mono tracking-widest text-center">
                    TAP ANYWHERE TO SKIP
                </p>
            </div>
        </motion.div>
    );
};

export default HelpOverlay;
