import {
  Container,
  Navbar,
  Nav,
  NavItem,
  Image,
  Button,
  Spinner,
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useTheme } from '../hooks/useTheme'
import ThemeSelector from './ThemeSelector'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import { useState, useEffect } from 'react'

//styles & images
import styles from './Navbar.module.css'
import logo from '../assets/checkmark.svg'

export default function Navigationbar() {
  const { logout, isPending } = useLogout()
  const { user } = useAuthContext()
  const { mode } = useTheme()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991.98)
    }
    // Set initial state and attach the event listener
    handleResize()
    window.addEventListener('resize', handleResize)
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Navbar
      style={{
        background:
          mode === 'light'
            ? 'linear-gradient(135deg, #D8A8F8, #3FAA96)'
            : 'linear-gradient(to right, #4E2A84, #007991)',
      }}
      data-bs-theme={mode === 'light' ? null : 'dark'}
      expand="lg"
    >
      <Container fluid>
        <LinkContainer to="/">
          <Navbar.Brand className="d-flex align-items-center">
            <Image
              src={logo}
              className={`d-none d-sm-inline-block align-top me-3 ${
                mode === 'dark' ? styles['img-dark'] : styles.img
              }`}
              alt="ProjectHub logo Green circle with yellow checkmark"
            />
            <h1
              className={`d-inline-block fs-3 fw-bold mb-0 ${styles['nav-header']}`}
            >
              ProjectHub
            </h1>
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav
            className={
              isMobile
                ? 'align-items-lg-center mt-2'
                : 'align-items-lg-center mt-lg-0'
            }
          >
            {!user && (
              <>
                <Nav.Item className="mb-2 mb-lg-0">
                  <LinkContainer to="/login">
                    <Nav.Link
                      className={`fs-4 ${styles['nav-btn-link']}`}
                      aria-label="Login"
                    >
                      Login
                    </Nav.Link>
                  </LinkContainer>
                </Nav.Item>

                <Nav.Item className="mb-2 mb-lg-0">
                  <LinkContainer to="/signup">
                    <Nav.Link
                      className={`fs-4 ${styles['nav-btn-link']}`}
                      aria-label="Signup"
                    >
                      Signup
                    </Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              </>
            )}

            {user && (
              <>
                <Nav.Item className={`mb-2 mb-lg-0 ${styles['nav-btn-link']}`}>
                  {!isPending && (
                    <Button
                      className={`fw-semibold ${
                        mode === 'dark'
                          ? styles['my-button-dark']
                          : styles['my-button']
                      }`}
                      variant="outline-light"
                      size="md"
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  )}

                  {isPending && (
                    <Button
                      className={`fw-semibold ${
                        mode === 'dark'
                          ? styles['my-button-dark']
                          : styles['my-button']
                      }`}
                      variant="outline-light"
                      size="md"
                      disabled
                    >
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      Logging out
                    </Button>
                  )}
                </Nav.Item>
              </>
            )}

            <NavItem className={`ms-lg-3 ${styles['nav-btn-link']}`}>
              <ThemeSelector />
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
