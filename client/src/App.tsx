import './App.css'
import { Button } from "@/components/ui/button"
import ProjectView from "./pages/ProjectView"
import Navbar from './components/Navbar'
import { ThemeProvider } from "@/components/ThemeProvider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className='h-screen'>
      <Navbar />
      <ProjectView projectName="Project name" />
      </div>
    </ThemeProvider>
  )
}

export default App
