import { useEffect, useState, lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import {
  Nav,
  Image,
  OverlayTrigger,
  Tooltip,
  Button,
  Spinner,
} from 'react-bootstrap'
import { useTheme } from '../hooks/useTheme'
import { useAuthContext } from '../hooks/useAuthContext'
import { Greeting } from './Greeting'
const OnlineUsers = lazy(() => import('./OnlineUsers'))
import SearchBar from './SearchBar'

//styles & images
import styles from './Sidebar.module.css'
import ArrowRightLight from '../assets/chevron_rightLight.svg'
import ArrowRightDark from '../assets/chevron_rightDark.svg'
import ArrowLeftLight from '../assets/chevron_leftLight.svg'
import ArrowLeftDark from '../assets/chevron_leftDark.svg'
import ArrowUpLight from '../assets/chevron_upLight.svg'
import ArrowUpDark from '../assets/chevron_upDark.svg'
import ArrowDownLight from '../assets/chevron_downLight.svg'
import ArrowDownDark from '../assets/chevron_downDark.svg'
import SearchLight from '../assets/search_iconLight.svg'
import SearchDark from '../assets/search_iconDark.svg'
import DashboardIconLight from '../assets/dashboard_iconLight.svg'
import DashboardIconDark from '../assets/dashboard_iconDark.svg'
import AddIconLight from '../assets/add_iconLight.svg'
import AddIconDark from '../assets/add_iconDark.svg'
import UserLight from '../assets/userLight.svg'
import UserDark from '../assets/userDark.svg'
import Avatar from './Avatar'

export default function Sidebar() {
  const { user } = useAuthContext()
  const { greeting } = Greeting()
  const { mode } = useTheme()

  const [showSidebar, setShowSidebar] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [showUsers, setShowUsers] = useState(false)
  const [activeLink, setActiveLink] = useState('/')

  const location = useLocation()

  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar)
    setExpanded(!expanded)
  }

  const handleUsersToggle = () => {
    setShowUsers(!showUsers)
  }

  useEffect(() => {
    setActiveLink(location.pathname)
  }, [location])

  return (
    <Nav
      activeKey={activeLink}
      className={`nav nav-pills nav-flush flex-column ${
        !expanded ? 'text-center' : ''
      }`}
      style={{
        backgroundColor: mode === 'light' ? '#D8A8F8' : '#4E2A84',
        width: expanded ? '21.9rem' : '5.5rem',
        minHeight: expanded ? '100vh' : 'auto',
      }}
      variant={mode === 'dark' ? 'dark' : 'light'}
    >
      <Button
        variant="outline-none"
        size="md"
        onClick={handleSidebarToggle}
        className={`rounded-0 p-1 ${
          mode === 'light' ? styles['my-button'] : styles['my-button-dark']
        }`}
      >
        {showSidebar ? (
          <Image
            className={styles.arrow}
            aria-label="chevron left"
            src={mode === 'dark' ? ArrowLeftDark : ArrowLeftLight}
            alt="arrow left"
            width={35}
            height={35}
          />
        ) : (
          <Image
            className={styles.arrow}
            aria-label="chevron right"
            src={mode === 'dark' ? ArrowRightDark : ArrowRightLight}
            alt="arrow right"
            width={35}
            height={35}
          />
        )}
      </Button>

      <div
        className={`d-flex align-items-center justify-content-center ${
          expanded ? 'ms-3' : ''
        }`}
      >
        <Avatar src={user.photoURL} />
        {expanded && (
          <span
            className={`text-center fs-5 py-3 user ${expanded ? 'px-2' : ''}`}
          >
            {greeting}
            {user.displayName}!
          </span>
        )}
      </div>

      <OverlayTrigger
        placement="right"
        overlay={
          !expanded ? <Tooltip id="search-tooltip">Search</Tooltip> : <></>
        }
      >
        <Nav.Item>
          <LinkContainer
            to="/search"
            aria-current={useLocation().pathname === '/search' ? 'page' : null}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              backgroundColor:
                useLocation().pathname === '/search'
                  ? mode === 'light'
                    ? '#5E60CE'
                    : '#7D5BA6'
                  : '',
            }}
          >
            <Nav.Link
              className={`nav-link py-3 border-bottom rounded-0 d-flex align-items-center ${
                !expanded ? 'justify-content-center' : ''
              }`}
            >
              <Image
                aria-label="Search"
                src={mode === 'dark' ? SearchDark : SearchLight}
                alt="search icon"
                width={20}
                height={20}
              />
              {expanded && <SearchBar />}
            </Nav.Link>
          </LinkContainer>
        </Nav.Item>
      </OverlayTrigger>

      <OverlayTrigger
        placement="right"
        overlay={
          !expanded ? (
            <Tooltip id="dashboard-tooltip">Dashboard</Tooltip>
          ) : (
            <></>
          )
        }
      >
        <Nav.Item>
          <LinkContainer
            to="/"
            aria-current={useLocation().pathname === '/' ? 'page' : null}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              backgroundColor:
                useLocation().pathname === '/'
                  ? mode === 'light'
                    ? '#5E60CE'
                    : '#7D5BA6'
                  : '',
            }}
          >
            <Nav.Link className="nav-link py-3 border-bottom rounded-0">
              <Image
                aria-label="Dashboard"
                src={mode === 'dark' ? DashboardIconDark : DashboardIconLight}
                alt="dashboard icon"
                width={20}
                height={20}
              />

              {expanded && (
                <span className="ms-2 align-middle d-inline-block">
                  Dashboard
                </span>
              )}
            </Nav.Link>
          </LinkContainer>
        </Nav.Item>
      </OverlayTrigger>

      <OverlayTrigger
        placement="right"
        overlay={
          !expanded ? <Tooltip id="create-tooltip">New Project</Tooltip> : <></>
        }
      >
        <Nav.Item>
          <LinkContainer
            to="/create"
            aria-current={useLocation().pathname === '/create' ? 'page' : null}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              backgroundColor:
                useLocation().pathname === '/create'
                  ? mode === 'light'
                    ? '#5E60CE'
                    : '#7D5BA6'
                  : '',
            }}
          >
            <Nav.Link
              eventKey="create"
              className="nav-link py-3 border-bottom rounded-0"
            >
              <Image
                aria-label="New Project"
                src={mode === 'dark' ? AddIconDark : AddIconLight}
                alt="add project icon"
                width={20}
                height={20}
              />

              {expanded && (
                <span className="ms-2 align-middle d-inline-block">
                  New Project
                </span>
              )}
            </Nav.Link>
          </LinkContainer>
        </Nav.Item>
      </OverlayTrigger>

      <OverlayTrigger
        placement="right"
        overlay={
          !expanded ? <Tooltip id="users-tooltip">All Users</Tooltip> : <></>
        }
      >
        <Nav.Item
          className={`py-3 ${expanded ? 'ps-3' : ''}`}
          style={{ cursor: 'pointer' }}
        >
          <div className="d-flex align-items-center justify-content-center">
            <Image
              aria-label="All Users"
              src={mode === 'dark' ? UserDark : UserLight}
              alt="all users"
              width={20}
              height={20}
            />

            {expanded && (
              <>
                <span className="ms-2 align-middle flex-grow-1">All Users</span>
                <Button
                  variant="outline-none"
                  size="md"
                  onClick={handleUsersToggle}
                  className={`rounded-0 ${styles['users-button']}`}
                >
                  {showUsers ? (
                    <Image
                      className={styles.arrow}
                      aria-label="chevron up"
                      src={mode === 'dark' ? ArrowUpDark : ArrowUpLight}
                      alt="arrow up"
                      width={35}
                      height={35}
                    />
                  ) : (
                    <Image
                      className={styles.arrow}
                      aria-label="chevron down"
                      src={mode === 'dark' ? ArrowDownDark : ArrowDownLight}
                      alt="arrow down"
                      width={35}
                      height={35}
                    />
                  )}
                </Button>
              </>
            )}
          </div>
          {expanded && showUsers && (
            <Suspense
              fallback={
                <Button
                  type="submit"
                  className={`w-100 my-3 fw-semibold ${
                    mode === 'dark'
                      ? styles['load-button-dark']
                      : styles['load-button']
                  }`}
                  variant="light"
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
                  Loading
                </Button>
              }
            >
              <OnlineUsers />
            </Suspense>
          )}
        </Nav.Item>
      </OverlayTrigger>
    </Nav>
  )
}
