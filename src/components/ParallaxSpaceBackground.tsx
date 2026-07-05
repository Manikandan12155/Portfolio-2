import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ParallaxSpaceBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();

    // Background Nebula Parallax
    const nebulaY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    
    // Planet Movement 
    const planetY = useTransform(scrollYProgress, [0, 1], ["5%", "35%"]);
    const planetRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

    // Star Movement
    const starY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    
    // Asteroid Movement
    const asteroidY = useTransform(scrollYProgress, [0, 1], ["10%", "-60%"]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-[1] overflow-hidden bg-[#020204]"
        >
            {/* 1. REAL HUBBLE SPACE TELESCOPE NEBULA */}
            <motion.div 
                className="absolute inset-[-15%] w-[130%] h-[130%] opacity-60 mix-blend-screen"
                style={{ y: nebulaY }}
            >
                <img 
                    src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000" 
                    alt="Space Nebula" 
                    className="w-full h-full object-cover"
                    style={{ filter: "saturate(1.2) contrast(1.1)" }}
                />
            </motion.div>

            {/* 2. REALISTIC SUPER-BRIGHT STAR (Light Source) */}
            <motion.div 
                className="absolute top-[5%] left-[5%] md:top-[10%] md:left-[10%] w-[300px] h-[300px] flex justify-center items-center z-10"
                style={{ y: starY }}
            >
                {/* Core */}
                <div className="absolute w-6 h-6 md:w-10 md:h-10 bg-white rounded-full shadow-[0_0_150px_60px_rgba(255,255,255,1),0_0_300px_150px_rgba(100,200,255,0.7)]" />
                
                {/* Optical Lens Flares */}
                <div className="absolute w-[300%] h-[2px] bg-white/60 rotate-[15deg] blur-[1px] shadow-[0_0_30px_10px_rgba(100,200,255,0.6)]" />
                <div className="absolute w-[200%] h-[1px] bg-cyan-200/40 rotate-[75deg] blur-[1px]" />
                <div className="absolute w-[400%] h-[100%] bg-[radial-gradient(ellipse_at_center,rgba(100,200,255,0.15)_0%,transparent_60%)] mix-blend-screen" />
            </motion.div>

            {/* 3. CINEMATIC LIGHT LEAK OVERLAY */}
            <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-br from-cyan-300/10 via-transparent to-transparent pointer-events-none mix-blend-screen z-10" />

            {/* 4. PHOTOREALISTIC PLANET */}
            <motion.div 
                className="absolute -right-[20%] md:right-[5%] top-[15%] md:top-[20%] w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full z-20"
                style={{ y: planetY, rotate: planetRotate }}
            >
                {/* Planet Texture Container */}
                <div className="w-full h-full rounded-full overflow-hidden relative shadow-[0_0_120px_rgba(50,150,255,0.15)]">
                    <img 
                        src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000" 
                        alt="Realistic Planet" 
                        className="absolute inset-0 w-[130%] h-[130%] object-cover -left-[15%] -top-[15%]"
                        style={{ filter: "contrast(1.15) saturate(1.1)" }}
                    />
                    
                    {/* Realistic 3D Shadow (Day/Night Terminator) */}
                    {/* Light is coming from Top-Left, so shadow is extremely dark on Bottom-Right */}
                    <div 
                        className="absolute inset-0 pointer-events-none" 
                        style={{
                            background: "radial-gradient(circle at 20% 20%, transparent 20%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.95) 65%, #000 100%)"
                        }}
                    />
                    
                    {/* Atmosphere Rim Light (Reflecting the star) */}
                    <div className="absolute inset-0 rounded-full shadow-[inset_15px_15px_40px_rgba(200,240,255,0.25),inset_-15px_-15px_30px_rgba(0,0,0,1)] pointer-events-none" />
                </div>
            </motion.div>

            {/* 5. FLOATING ASTEROID (Adds depth) */}
            <motion.div 
                className="absolute top-[80%] left-[20%] w-12 h-16 bg-black rounded-[40%_60%_70%_30%] z-30"
                style={{ y: asteroidY, rotate: 45 }}
            >
                {/* Asteroid Shadow & Highlight matching the star's light source */}
                <div className="w-full h-full rounded-[40%_60%_70%_30%] shadow-[inset_3px_3px_10px_rgba(200,240,255,0.4),inset_-5px_-5px_15px_rgba(0,0,0,0.9)]" />
            </motion.div>
        </div>
    );
};

export default ParallaxSpaceBackground;
