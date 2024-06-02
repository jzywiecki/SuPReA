import './App.css'
import { Button } from "@/components/ui/button"
import ProjectView from "./pages/ProjectView"
import Navbar from './components/Navbar'
import { ThemeProvider } from "@/components/ThemeProvider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navbar />
      <ProjectView />
      <Button>Click me</Button>
    </ThemeProvider>
  )
}

export default App
