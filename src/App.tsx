import { NavBar } from "@/components/portfolio/NavBar";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { CharacterSheetSection } from "@/components/portfolio/CharacterSheetSection";
import { TreasureMapSection } from "@/components/portfolio/TreasureMapSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ConnectSection } from "@/components/portfolio/ConnectSection";
import { PortfolioChatbot } from "@/components/chatbot/PortfolioChatbot";
import { portfolioData } from "@/components/portfolio/portfolio-data";

function App() {
  return (
    <>
      <NavBar />
      <HeroSection hero={portfolioData.hero} />
      <CharacterSheetSection about={portfolioData.about} />
      <TreasureMapSection experience={portfolioData.experience} />
      <ProjectsSection projects={portfolioData.projects} />
      <ConnectSection connect={portfolioData.connect} />
      <PortfolioChatbot />
    </>
  );
}

export default App;
