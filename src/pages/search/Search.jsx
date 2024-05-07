import { useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'

//styles
import styles from './Search.module.css'
import { Spinner, Container } from 'react-bootstrap'

//components
import ProjectList from '../../components/ProjectList'

export default function Search() {
  const queryString = useLocation().search
  const queryParams = new URLSearchParams(queryString)
  const query2 = queryParams.get('q')
  const { mode } = useTheme()

  const [projects, setProjects] = useState(null)
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      try {
        if (!query2) {
          setProjects([])
          setError(false)
        } else {
          const snapshot = await getDocs(collection(db, 'projects'))
          const searchResults = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((project) =>
              project.name.toLowerCase().includes(query2.toLowerCase())
            )

          if (searchResults.length === 0) {
            setError('No projects found matching your search criteria.')
            setProjects([])
          } else {
            // Sort the search results by dueDate in ascending order
            const sortedResults = searchResults.sort(
              (a, b) =>
                a.dueDate.toDate().getTime() - b.dueDate.toDate().getTime()
            )
            setProjects(sortedResults)
            setError(false)
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(error)
        }
        setError('Error occurred while fetching data.')
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [query2])

  return (
    <Container
      fluid
      className={`mb-4 ${
        mode === 'dark' ? styles['search-dark'] : styles['search']
      }`}
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <h2 className={`fs-2 fw-bolder text-center my-3 ${styles['page-title']}`}>
        Search results for "{query2}"
      </h2>
      {error && <p className="fs-4 text-center">{error}</p>}
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center mt-5">
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
      ) : (
        projects && (
          <div
            className={`${styles['card-container']} my-4`}
            style={{
              flex: '1',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <ProjectList projects={projects} isSearchPage={true} />
          </div>
        )
      )}
    </Container>
  )
}
