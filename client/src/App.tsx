import './App.css'
import Navbar from './components/Navbar'
import { ThemeProvider } from "@/components/ThemeProvider"
import ErrorPage from "./pages/ErrorPage";
import ProjectsView from './pages/ProjectsView';
import CreateProject from './pages/CreateProject';
import { Routes, Route } from 'react-router-dom';
import Profile from './pages/Profile';
import Collaborators from './pages/Collaborators';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className='h-screen'>
        <Navbar />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/projects" element={<ProjectsView />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/collaborators" element={<Collaborators />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
