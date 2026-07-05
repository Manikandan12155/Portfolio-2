import { useState } from "react";
import HelpOverlay from "@/components/HelpOverlay";
import ThreeSpaceBackground from "@/components/ThreeSpaceBackground";
import ScrollRocket from "@/components/ScrollRocket";
import Chatbot from "@/components/Chatbot";
import MoonFloor from "@/components/MoonFloor";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import EducationSection from "@/components/EducationSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {showHelp && <HelpOverlay onClose={() => setShowHelp(false)} />}
      <ThreeSpaceBackground />
      <ScrollRocket />
      <Chatbot />
      <Navbar onHelpClick={() => setShowHelp(true)} />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <EducationSection />
        <ProjectsSection />
        <ContactSection />
        <MoonFloor />
      </main>
    </div>
  );
};

export default Index;
