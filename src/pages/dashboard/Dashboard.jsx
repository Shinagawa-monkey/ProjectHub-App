import ProjectList from '../../components/ProjectList'
import ProjectFilter from './ProjectFilter'
import { useCollection } from '../../hooks/useCollection'
import { useTheme } from '../../hooks/useTheme'
import { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'

//styles
import styles from './Dashboard.module.css'
import { Spinner, Container } from 'react-bootstrap'

export default function Dashboard() {
  const { user } = useAuthContext()
  const { mode } = useTheme()
  const { documents, error } = useCollection('projects')
  const { updateDocument } = useFirestore('projects')
  const [currentFilter, setCurrentFilter] = useState('all')
  const [filteredProjects, setFilteredProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (documents) {
      const filtered = documents.filter((document) => {
        switch (currentFilter) {
          case 'all':
            return true
          case 'mine':
            return document.assignedUsersList.some((u) => user.uid === u.id)
          default:
            return document.category === currentFilter
        }
      })
      setFilteredProjects(filtered)
      setIsLoading(false)
    }
  }, [documents, currentFilter, user])

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter)
  }

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner
          animation={mode === 'dark' ? 'border' : 'grow'}
          role="status"
          className={
            mode === 'dark' ? styles['spinner-dark'] : styles['spinner-light']
          }
        >
          <span className="visually-hidden">Loading</span>
        </Spinner>
      </div>
    )
  }

  const handleUpdateProject = async (updatedProject) => {
    try {
      // Update the project in the Firebase Firestore
      await updateDocument('projects', updatedProject.id, updatedProject)
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Error updating project:', error)
      }
    }
  }

  return (
    <Container>
      <div
        className={`my-auto ${
          mode === 'dark' ? styles['dashboard-dark'] : styles['dashboard']
        }`}
      >
        <h2 className="fs-2 fw-bolder text-center my-3">Dashboard</h2>
        {error && <p className="fs-4 text-center">{error}</p>}
        {documents && (
          <ProjectFilter
            currentFilter={currentFilter}
            changeFilter={changeFilter}
          />
        )}
        <div className={`mb-4 ${styles['card-container']}`}>
          {filteredProjects.length > 0 ? (
            <ProjectList
              projects={filteredProjects}
              isDashboardPage={true}
              updateProject={handleUpdateProject}
            />
          ) : (
            <p className="fs-4 text-center">
              <span className="fw-bolder">
                No projects found in this category.
              </span>
              <br />
              <span className="fw-normal">
                Start by adding projects or try a different category.
              </span>
            </p>
          )}
        </div>
      </div>
    </Container>
  )
}
