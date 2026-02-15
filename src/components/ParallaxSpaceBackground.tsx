import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ParallaxSpaceBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();

    // Sun Movement: Moving slowly down (or up relative to scroll) to simulate distance
    // 'reality' usually means distant objects move slower than foreground.
    // Foreground scrolls 100%. Sun should move maybe 20%.
    const sunY = useTransform(scrollYProgress, [0, 1], ["5%", "20%"]);
    const sunX = useTransform(scrollYProgress, [0, 1], ["5%", "2%"]); // Top Left

    // Moon Movement: Rising slightly to settle in the bottom right corner
    const moonY = useTransform(scrollYProgress, [0, 1], ["100%", "60%"]); // Starts off-screen, ends at bottom-right
    const moonX = useTransform(scrollYProgress, [0, 1], ["-10%", "-5%"]); // Kept mostly stable on the right
    const moonScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.2]);


    // Nebulae/Clouds for depth (optional, keeping it simple first with just Sun/Moon as requested)
    // We can add a subtle planet or galaxy

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        >
            {/* Sun - Top Right initially */}
            <motion.div
                className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full blur-2xl opacity-80 flex items-center justify-center"
                style={{
                    top: 0,
                    left: 0,
                    y: sunY,
                    x: sunX,
                    background: "radial-gradient(circle, rgba(255,200,50,0.4) 0%, rgba(255,100,0,0.1) 60%, transparent 100%)",
                    boxShadow: "0 0 60px 20px rgba(255, 150, 0, 0.15)",
                }}
            >
                {/* Core of sun - perfectly round */}
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-200 to-orange-500 opacity-90" />
            </motion.div>

            {/* Moon - Bottom Left moving up */}
            <motion.div
                className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full"
                style={{
                    top: 0,
                    right: 0,
                    left: "auto",
                    y: moonY,
                    x: moonX,
                    scale: moonScale,
                    boxShadow: "inset -10px -10px 20px rgba(0,0,0,0.8), 0 0 20px rgba(100,100,255,0.2)",
                }}
            >
                {/* Moon Texture Gradient */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 overflow-hidden relative">
                    {/* Craters */}
                    <div className="absolute top-4 left-6 w-6 h-6 rounded-full bg-slate-500/30 shadow-inner" />
                    <div className="absolute bottom-6 right-8 w-8 h-8 rounded-full bg-slate-500/30 shadow-inner" />
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-slate-500/20 shadow-inner" />
                    <div className="absolute top-10 right-4 w-3 h-3 rounded-full bg-slate-500/40 shadow-inner" />
                </div>
                {/* Shadow for phase effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/80 via-transparent to-transparent" />
            </motion.div>

            {/* Distant Planet/Star - subtle extra detail */}
            <motion.div
                className="absolute w-8 h-8 rounded-full bg-blue-400 blur-sm opacity-60"
                style={{
                    top: "40%",
                    right: "20%",
                    y: useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]),
                }}
            />

        </div>
    );
};

export default ParallaxSpaceBackground;
