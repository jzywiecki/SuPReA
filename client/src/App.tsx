// App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorPage from "./pages/ErrorPage";
import ProjectsView from './pages/ProjectsView';
import CreateProject from './pages/CreateProject';
import Profile from './pages/Profile';
import Collaborators from './pages/Collaborators';
import ProjectView from './pages/ProjectView';
import NameList from './pages/projectPages/NameList';
import RequirementsList from './pages/projectPages/RequirementsList';
import RiskList from './pages/projectPages/RisksList';
import MottoList from './pages/projectPages/MottoList';
import SpecificationsList from './pages/projectPages/SpecificationsList';
import StrategyList from './pages/projectPages/StrategyList';
import ActorList from './pages/projectPages/ActorsList';
import ElevatorSpeech from './pages/projectPages/ElevatorSpeech';
import BusinessScenario from './pages/projectPages/BusinesScenario';
import Hero from './components/Hero';
import UMLDiagrams from './pages/projectPages/umlDiagrams';


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className='h-screen'>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/projects" element={<ProjectsView />} />
          <Route path="/projects/:projectID" element={<ProjectView />}>
            <Route path="name" element={<NameList />} />
            <Route path="requirements" element={<RequirementsList />} />
            <Route path="risk" element={<RiskList />} />
            <Route path="motto" element={<MottoList />} />
            <Route path="specifications" element={<SpecificationsList />} />
            <Route path="strategy" element={<StrategyList />} />
            <Route path="actors" element={<ActorList />} />
            <Route path="elevator-speech" element={<ElevatorSpeech />} />
            <Route path="business-scenario" element={<BusinessScenario />} />
            <Route path="uml" element={<UMLDiagrams />} />
          </Route>
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/collaborators" element={<Collaborators />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>

    </ThemeProvider>
  );
}

export default App;
