import { useTheme } from '../../hooks/useTheme'

//styles
import { Button, Nav } from 'react-bootstrap'
import styles from './Dashboard.module.css'

const filterList = [
  'all',
  'mine',
  'design',
  'hr',
  'marketing',
  'management',
  'sales',
  'development',
]

export default function ProjectFilter({ currentFilter, changeFilter }) {
  const { mode } = useTheme()

  const handleClick = (newFilter) => {
    changeFilter(newFilter)
  }

  return (
    <div className={`mb-4 ${styles['project-filter']}`}>
      <Nav className="align-items-center flex-wrap">
        <Nav.Item>
          <span className="fw-bolder me-2">Filter by:</span>
        </Nav.Item>
        {filterList.map((f) => (
          <Nav.Item key={f}>
            <Button
              onClick={() => handleClick(f)}
              className={`me-1 mb-1 ${
                mode === 'dark' ? styles['my-button-dark'] : styles['my-button']
              }`}
              style={
                currentFilter === f
                  ? {
                      borderColor: mode === 'dark' ? '#f8f9df' : '#3c0b6b',
                      color: mode === 'dark' ? '#3c0b6b' : '#f8f9df',
                      backgroundColor: mode === 'dark' ? '#f8f9df' : '#3c0b6b',
                    }
                  : null
              }
              variant={currentFilter === f ? 'light' : 'outline-light'}
              size="md"
            >
              {f}
            </Button>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  )
}
