import { LinkContainer } from 'react-router-bootstrap'
import Avatar from './Avatar'
import { useTheme } from '../hooks/useTheme'

//styles
import styles from './ProjectList.module.css'
import { Card, Col, ProgressBar } from 'react-bootstrap'

export default function ProjectList({
  projects,
  isDashboardPage,
  isSearchPage,
}) {
  const { mode } = useTheme()

  if (!isSearchPage && projects.length === 0) {
    // Return null to hide the component
    return null
  }

  if (isDashboardPage && projects.length === 0) {
    return (
      <p className="fs-4 my-auto text-center">
        <span className="fw-bolder">No projects found.</span> <br />
        <span className="fw-normal">Start by adding projects.</span>
      </p>
    )
  }

  const priorityColors = {
    critical: mode === 'light' ? '#FF725C' : '#FF2400',
    high: mode === 'light' ? '#FFAC5C' : '#FF6F00',
    medium: mode === 'light' ? '#FFD65C' : '#FF8C00',
    low: mode === 'light' ? '#B6FF5C' : '#3D9140',
  }

  // Sort projects by dueDate in descending order (newest first)
  const sortedProjects = projects.sort((a, b) => b.dueDate - a.dueDate)

  return (
    <>
      {sortedProjects.map((project) => (
        <Col key={project.id}>
          <Card
            className={`mb-4 ${
              mode === 'dark' ? styles['card-dark'] : styles['card']
            } ${projects.length === 1 ? 'col-lg-6' : 'col-md-12'}`}
          >
            <LinkContainer to={`/projects/${project.id}`}>
              <div className={styles['card-content']}>
                <Card.Header>
                  <Card.Title as="h3" className="fs-4 mb-0">
                    {project.name}
                  </Card.Title>
                  <Card.Subtitle
                    className={`fs-6 my-2 ${
                      mode === 'dark' ? '' : 'text-secondary'
                    } `}
                  >
                    <p className="fw-bolder mb-2">
                      Created By:{' '}
                      <span className="fw-normal">
                        {project.createdBy.displayName}
                      </span>
                    </p>
                    <p className="fw-bolder">
                      Due Date:{' '}
                      <span className="fw-normal">
                        {project.dueDate.toDate().toDateString()}
                      </span>
                    </p>
                  </Card.Subtitle>
                </Card.Header>
                <Card.Body>
                  <Card.Text className="mb-2 fw-bolder">
                    Category:{' '}
                    <span className="text-capitalize fw-normal">
                      {project.category}
                    </span>
                  </Card.Text>
                  <Card.Text className="d-flex align-items-center mb-2 fw-bolder">
                    Assigned To:
                    <div className="ms-2 d-flex">
                      {project.assignedUsersList.map((user, index) => (
                        <div key={user.id} className="me-2">
                          <Avatar
                            src={user.photoURL}
                            size={32}
                            padding={false}
                          />
                        </div>
                      ))}
                    </div>
                  </Card.Text>
                  <Card.Text className="mb-2 fw-bolder">
                    Priority: {''}
                    <span
                      className="px-2 text-capitalize"
                      style={{
                        backgroundColor: priorityColors[project.priority],
                        borderRadius: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {project.priority}
                    </span>
                  </Card.Text>
                  <Card.Text className="mb-2 fw-bolder">
                    <div className="d-flex align-items-center">
                      Progress:{' '}
                      <ProgressBar
                        className={`rounded-pill ms-2 w-100 fw-normal ${
                          mode === 'dark'
                            ? styles['progress-bar-dark']
                            : styles['progress-bar']
                        }`}
                        variant="success"
                        now={project.progress}
                        label={`${project.progress}%`}
                        min={0}
                        max={100}
                      />
                    </div>
                  </Card.Text>
                </Card.Body>
              </div>
            </LinkContainer>
          </Card>
        </Col>
      ))}
    </>
  )
}
