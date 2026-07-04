import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ParallaxSpaceBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();

    // Sun Movement: Moving slowly down (or up relative to scroll) to simulate distance
    const sunY = useTransform(scrollYProgress, [0, 1], ["5%", "25%"]);
    const sunX = useTransform(scrollYProgress, [0, 1], ["5%", "2%"]);

    // Moon Movement: Rising slightly 
    const moonY = useTransform(scrollYProgress, [0, 1], ["80%", "50%"]);
    const moonX = useTransform(scrollYProgress, [0, 1], ["-10%", "-5%"]);
    const moonScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.2]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-[1] overflow-hidden bg-transparent"
        >
            {/* Deep Space Atmosphere Tint */}
            <div className="absolute inset-0 bg-[#020408]/60" />
            {/* CINEMATIC REAL SUN - Zero Sharp Edges */}
            <motion.div
                className="absolute w-[450px] h-[450px] md:w-[700px] md:h-[700px] flex items-center justify-center pointer-events-none"
                style={{
                    top: "-15%",
                    left: "-15%",
                    y: sunY,
                    x: sunX,
                }}
            >
                {/* 1. Global Heat Aura (Vast soft glow - even softer) */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,100,0,0.15)_0%,transparent_80%)] blur-[120px]" />

                {/* 2. Soft Corona (Minimal and very blurred to avoid 'ring' look) */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
                    className="absolute w-[90%] h-[90%] bg-[radial-gradient(circle,rgba(255,150,0,0.1)_0%,transparent_70%)] blur-[80px]"
                />

                {/* 3. The Core Body (The actual star - Small for perspective) */}
                <div className="relative w-16 h-16 md:w-32 md:h-32 rounded-full overflow-hidden">
                    {/* Base Solar Fire */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#fff9e6_0%,#ffd700_30%,#ff8c00_60%,#e65100_100%)]" />

                    {/* Moving Plasma Texture */}
                    <motion.img
                        animate={{
                            x: ["-5%", "5%", "-5%"],
                            y: ["-5%", "5%", "-5%"],
                            scale: [1.2, 1.4, 1.2]
                        }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80"
                        alt=""
                        className="w-[110%] h-[110%] object-cover mix-blend-overlay opacity-80 brightness-125 contrast-150"
                    />

                    {/* Intense Inner Core Bloom */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.3)_0%,transparent_50%)]" />
                    <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]" />
                </div>

                {/* 4. Realistic Lens Flares */}
                <div className="absolute w-[180%] h-[1px] bg-white/5 blur-[2px] rotate-[35deg]" />
                <div className="absolute w-[140%] h-[1px] bg-orange-400/10 blur-[4px] rotate-[-25deg]" />
            </motion.div>

            {/* CINEMATIC REAL MOON - Cleaned up */}
            <motion.div
                className="absolute w-24 h-24 md:w-56 md:h-56 rounded-full"
                style={{
                    top: "15%",
                    right: "5%",
                    left: "auto",
                    y: moonY,
                    x: moonX,
                    scale: moonScale,
                }}
            >
                {/* Moon Body */}
                <div className="relative w-full h-full rounded-full overflow-hidden bg-black">
                    {/* Realistic Lunar Surface Mapping */}
                    <motion.img
                        animate={{
                            rotate: [0, -5, 0],
                        }}
                        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                        src="https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800&q=80"
                        alt="Moon Surface"
                        className="w-full h-full object-cover scale-[1.8] brightness-110 contrast-125 saturate-0"
                    />

                    {/* Phase Shadow (Crescent effect) */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,transparent_30%,rgba(0,0,0,0.8)_80%,#000_100%)] opacity-95" />
                </div>

                {/* Rim Lighting (Subtle) */}
                <div className="absolute inset-0 rounded-full shadow-[inset_10px_10px_20px_rgba(255,255,255,0.05),inset_-1px_-1px_5px_rgba(0,0,0,0.5)]" />
            </motion.div>

            {/* Deep Space Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,150,0,0.05)_0%,transparent_50%)]" />
        </div>
    );
};

export default ParallaxSpaceBackground;
