import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import Home from '@/components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Error from './components/pages/Error';
import NewProject from './components/pages/NewProject';
import UserContextProvider from './contexts/UserContextProvider';
import ThemeContextProvider from './contexts/ThemeContextProvider';
import SnackbarContextProvider from './contexts/SnackbarContextProvider';

function App() {

  return (
    <>
    <SnackbarContextProvider>
      <ThemeContextProvider>
        <UserContextProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/projects" element={<h1>Hello world!</h1>} />
            <Route path="/project/:projectID" element={<Outlet />}>
              <Route path="settings" element={<h1>setting!</h1>} />
              <Route path="summary" element={<h1>Hello world!</h1>} />
              <Route path="component" element={<Outlet />} >
                <Route path="name" element={<h1>Name!</h1>} />
                <Route path="requirements" element={<h1>Hello world!</h1>} />
                <Route path="risk" element={<h1>Hello world!</h1>} />
                <Route path="motto" element={<h1>Hello world!</h1>} />
                <Route path="specifications" element={<h1>Hello world!</h1>} />
                <Route path="strategy" element={<h1>Hello world!</h1>} />
                <Route path="actors" element={<h1>Hello world!</h1>} />
                <Route path="elevator-speech" element={<h1>Hello world!</h1>} />
                <Route path="business-scenario" element={<h1>Hello world!</h1>} />
                <Route path="uml" element={<h1>Hello world!</h1>} />
                <Route path="schedule" element={<h1>Hello world!</h1>} />
                <Route path="database-diagram" element={<h1>Hello world!</h1>} />
                <Route path="logo" element={<h1>Hello world!</h1>} />
              </Route>
            </Route>
            <Route path="/create-project" element={<NewProject/>} />
            <Route path="/profile/:id" element={<h1>Hello world!</h1>} />
            <Route path="/collaborators" element={<h1>Hello world!</h1>} />
            <Route path="not-found" element={<Error errorCode={404}/>} />
            <Route path="*" element={<Error errorCode={404}/>} />
          </Routes>
        </UserContextProvider>
      </ThemeContextProvider>
      </SnackbarContextProvider>
    </>
  )
}

export default App
