import React, { useRef } from "react";
import Hero from "../components/Hero";
import IntroductionWithPicture from "@/components/IntroductionWithPicture";
import CTASection from "@/components/CTASection";

const HomePage = () => {
  const firstIntroductionRef = useRef(null);
  const projectFeatures = [
    {
      name: "AI-Powered Requirement Generation",
      description:
        "Generate detailed and tailored project requirements instantly with AI, streamlining the planning phase and ensuring clarity for all stakeholders.",
    },
    {
      name: "Seamless Team Collaboration",
      description:
        "Enable your team to work together effortlessly with real-time project updates and shared progress tracking, ensuring everyone stays aligned and engaged.",
    },
    {
      name: "AI-Driven Data Analysis and Editing",
      description:
        "Utilize AI to analyze and edit project data with precision, giving teams powerful insights and tools to refine requirements and enhance decision-making.",
    },
  ];

  const projectGenerationFeatures = [
    {
      name: "Defining Project Goal",
      description:
        "We start by clearly defining the project goal, which helps to understand the tasks and requirements that must be included in the project creation process.",
    },
    {
      name: "Selecting AI Model",
      description:
        "Based on the defined goal, we choose the appropriate AI model that best fits the project requirements and enables the automation of the project requirements generation process.",
    },
  ];

  const handleClickLearnMore = () => {
    if (firstIntroductionRef.current) {
      firstIntroductionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div>
      <Hero onLearnMoreClick={handleClickLearnMore} />
      <IntroductionWithPicture
        ref={firstIntroductionRef} 
        title="Optimize your workflow"
        subtitle="Streamlined Project Management"
        description="Our platform combines AI capabilities and collaborative tools to help teams create precise project requirements and stay organized from start to finish."
        features={projectFeatures}
        imageSrc="./public/projectview.png"
        imageAlt="Project management app screenshot"
      />
      <IntroductionWithPicture
        title="Project Generation by AI"
        subtitle="Automate Your Project Process"
        description="Our platform enables project creation through AI, which helps in precisely defining the goal and selecting the appropriate AI models to accomplish the tasks. This makes the planning process simpler and faster."
        features={projectGenerationFeatures}
        imageSrc="./public/generationview.png"
        imageAlt="Project Generation by AI"
      />
      <CTASection
        title="Dive Deeper"
        description="Discover how our platform can transform your project management process."
      />
    </div>
  );
};

export default HomePage;
