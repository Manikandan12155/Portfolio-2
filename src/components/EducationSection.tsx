import { motion } from "framer-motion";

import { GraduationCap, Calendar, Award, Rocket, Radio, Star, Flag, Code, Cpu } from "lucide-react";

const EducationSection = () => {


    const education = [
        {
            degree: "Python Full Stack Development",
            field: "Full Stack Engineering",
            institution: "Ether Infotech",
            period: "Certification",
            score: "Completed",
            description: "Advanced training in Python backend architecture, REST APIs, and modern frontend integration.",
            icon: Code
        },
        {
            degree: "MERN Stack Development",
            field: "Web Development",
            institution: "Leiten Technologies",
            period: "Certification",
            score: "Completed",
            description: "Intensive bootcamp on MongoDB, Express.js, React, and Node.js ecosystem.",
            icon: Cpu
        },
        {
            degree: "B.Sc Information Technology",
            field: "Information Technology",
            institution: "Bharathiar University Arts and Science College, Valparai",
            period: "2019 - 2022",
            score: "81%",
            description: "Specialized in core IT concepts, programming, and software development methodologies.",
            icon: Rocket
        },
        {
            degree: "Higher Secondary (12th)",
            field: "State Board",
            institution: "Government Higher Secondary School, Valparai",
            period: "2018 - 2019",
            score: "766 / 1200",
            description: "Completed Higher Secondary education with focus on academic excellence.",
            icon: Star
        },
        {
            degree: "Secondary (10th)",
            field: "State Board",
            institution: "Government Higher Secondary School, Valparai",
            period: "2016 - 2017",
            score: "415 / 500",
            description: "Completed Secondary School Leaving Certificate with distinction.",
            icon: Flag
        }
    ];

    return (
        <section id="education" className="relative py-32 overflow-hidden bg-transparent">


            <div className="relative z-10 max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 text-center"
                >
                    <div className="inline-flex items-center gap-2 text-primary/80 font-mono text-xs tracking-[0.3em] mb-4 bg-primary/5 px-4 py-2 rounded-full border border-primary/20 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]">
                        <Radio size={12} className="animate-pulse" />
                        MISSION LOG: ACADEMIC
                    </div>
                    <h2 className="font-display text-4xl md:text-6xl font-black mt-2 tracking-tight">
                        <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">TRAJECTORY</span>
                        <span className="text-primary block md:inline md:ml-4">HISTORY</span>
                    </h2>
                </motion.div>

                <div className="relative sm:pl-8">
                    {/* Vertical Trajectory Line */}
                    <div className="absolute left-4 top-4 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent hidden sm:block">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-grid-pattern opacity-50"></div>
                    </div>

                    <div className="space-y-16">
                        {education.map((edu, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 group"
                            >
                                {/* Orbital Node */}
                                <div className="hidden sm:flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-black border-2 border-primary relative z-10 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform duration-500">
                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    </div>
                                    {/* Connection Beam */}
                                    {index !== education.length - 1 && (
                                        <div className="w-px h-full bg-dashed-line opacity-50 mt-2" />
                                    )}
                                </div>

                                {/* Mission Card */}
                                <div className="relative">
                                    {/* Decorator Line */}
                                    <div className="absolute -left-4 top-4 w-4 h-px bg-primary/30 hidden sm:block" />

                                    <div className="glass-panel p-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-primary/40 transition-colors duration-500 group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)]">
                                        <div className="bg-black/80 backdrop-blur-xl rounded-xl p-6 relative overflow-hidden">
                                            {/* Tech Grid Background */}
                                            <div className="absolute inset-0 bg-grid-white/[0.02]" />
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <edu.icon size={100} />
                                            </div>

                                            {/* Header */}
                                            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary text-black">
                                                            MSN-{20 - index}
                                                        </span>
                                                        <span className="text-primary/60 font-mono text-xs tracking-widest">CONFIRMED</span>
                                                    </div>
                                                    <h3 className="text-2xl font-display font-bold text-white mb-1">
                                                        {edu.field}
                                                    </h3>
                                                    <div className="text-lg text-muted-foreground font-light">
                                                        {edu.degree}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 bg-white/5 py-1.5 px-3 rounded-lg border border-white/5 md:self-start">
                                                    <Calendar size={14} className="text-primary" />
                                                    <span className="font-mono text-xs text-primary/80">{edu.period}</span>
                                                </div>
                                            </div>

                                            {/* Data Grid */}
                                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-6">
                                                <div>
                                                    <div className="text-[10px] font-mono text-primary/50 mb-1 tracking-wider">BASE STATION</div>
                                                    <div className="flex items-center gap-2 text-white/90">
                                                        <Flag size={14} className="text-secondary" />
                                                        <span className="font-bold tracking-tight">{edu.institution}</span>
                                                    </div>
                                                </div>

                                                {edu.score && (
                                                    <div>
                                                        <div className="text-[10px] font-mono text-primary/50 mb-1 tracking-wider flex items-center gap-2">
                                                            PERFORMANCE METRIC
                                                            <div className="h-px flex-1 bg-white/10" />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Award size={14} className="text-yellow-500" />
                                                            <span className="font-mono text-yellow-500/90 font-bold">{edu.score}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="md:col-span-2">
                                                    <div className="text-[10px] font-mono text-primary/50 mb-2 tracking-wider">MISSION SUMMARY</div>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {edu.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EducationSection;
