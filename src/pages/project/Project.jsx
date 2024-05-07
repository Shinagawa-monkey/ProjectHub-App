import { useParams, useNavigate } from 'react-router-dom'
import { useDocument } from '../../hooks/useDocument'
import ProjectSummary from './ProjectSummary'
import ProjectComments from './ProjectComments'
import { useTheme } from '../../hooks/useTheme'

//styles
import styles from './Project.module.css'
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap'

export default function Project() {
  const { id } = useParams()
  const { error, document } = useDocument('projects', id)
  const { mode } = useTheme()
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <Container
      className={`mx-auto my-4 ${
        mode === 'dark'
          ? styles['project-container-dark']
          : styles['project-container']
      }`}
    >
      <div className="text-center my-auto">
        <Button
          onClick={handleGoHome}
          className={`mb-4 fw-semibold ${
            mode === 'dark' ? styles['my-button-dark'] : styles['my-button']
          }`}
          variant="light"
          size="md"
        >
          Return to Dashboard
        </Button>
      </div>
      <Row className="justify-content-between align-items-start pb-5">
        <Col lg={9} xs={12} className="mb-4 mb-lg-0">
          {error ? (
            <p>{error}</p>
          ) : (
            <>
              {document ? (
                <ProjectSummary project={document} />
              ) : (
                <Spinner
                  animation={mode === 'dark' ? 'border' : 'grow'}
                  role="status"
                  className={
                    mode === 'dark'
                      ? styles['spinner-dark']
                      : styles['spinner-light']
                  }
                >
                  <span className="visually-hidden">Loading</span>
                </Spinner>
              )}
            </>
          )}
        </Col>
        <Col lg={3} xs={12}>
          {document && <ProjectComments project={document} />}
        </Col>
      </Row>
    </Container>
  )
}
