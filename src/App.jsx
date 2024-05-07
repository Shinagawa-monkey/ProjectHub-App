import { Routes, Route, Navigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

//styles
// import './App.css'

//pages and components
import Navigationbar from './components/Navbar'
import Dashboard from './pages/dashboard/Dashboard'
import Search from './pages/search/Search'
import Create from './pages/create/Create'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Project from './pages/project/Project'
import NotFound from './pages/notFound/NotFound'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import { useAuthContext } from './hooks/useAuthContext'
import { useTheme } from './hooks/useTheme'

function App() {
  const { authIsReady, user } = useAuthContext()
  const { mode } = useTheme()

  return (
    <div
      className={`App d-flex ${
        mode === 'light' ? 'bg-light text-dark' : 'bg-dark text-white'
      }`}
      style={{ minHeight: '100vh' }}
    >
      {user && <Sidebar />}
      {authIsReady && (
        <Container fluid className="p-0" id="main-content">
          <a href="#main-content" className="visually-hidden">
            Skip to main content
          </a>

          <Navigationbar />

          <Routes>
            <Route
              path="/"
              element={
                user ? <Dashboard /> : <Navigate to="/login" replace={true} />
              }
            />
            <Route
              path="/search"
              element={
                user ? <Search /> : <Navigate to="/login" replace={true} />
              }
            />
            <Route
              path="/create"
              element={
                user ? <Create /> : <Navigate to="/login" replace={true} />
              }
            />
            <Route
              path="/projects/:id"
              element={
                user ? <Project /> : <Navigate to="/login" replace={true} />
              }
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" replace={true} />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" replace={true} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </Container>
      )}
    </div>
  )
}

export default App
