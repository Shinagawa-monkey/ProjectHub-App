import { useEffect, useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import Select from 'react-select'
import { useCollection } from '../../hooks/useCollection'
import { timestamp } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'
import { useNavigate } from 'react-router-dom'

//styles
import styles from './Create.module.css'
import {
  Form,
  Button,
  Spinner,
  ProgressBar,
  Image,
  Container,
  Row,
  Col,
} from 'react-bootstrap'
import ArrowLeftLight from '../../assets/chevron_leftLightPurple.svg'
import ArrowLeftDark from '../../assets/chevron_leftDark.svg'

const categories = [
  { value: 'design', label: 'Design' },
  { value: 'hr', label: 'HR' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'management', label: 'Project Management' },
  { value: 'sales', label: 'Sales & CRM' },
  { value: 'development', label: 'Software Development' },
]

const statusOptions = [
  { value: 'done', label: 'Done', color: '' },
  { value: 'working', label: 'Working on it', color: '' },
  { value: 'stuck', label: 'Stuck', color: '' },
  { value: 'awaiting', label: 'Awaiting review', color: '' },
  { value: 'notStarted', label: 'Not Started', color: '' },
]

const priorityOptions = [
  { value: 'critical', label: 'Critical', color: '' },
  { value: 'high', label: 'High', color: '' },
  { value: 'medium', label: 'Medium', color: '' },
  { value: 'low', label: 'Low', color: '' },
]

export default function Create() {
  const navigate = useNavigate()
  const { addDocument, response } = useFirestore('projects')
  const { documents } = useCollection('users')
  const [users, setUsers] = useState([])
  const { user } = useAuthContext()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(null)

  //form field values
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([])
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [progress, setProgress] = useState(0)
  const [categoryError, setCategoryError] = useState('')
  const [assignedUsersError, setAssignedUsersError] = useState('')
  const [statusError, setStatusError] = useState('')
  const [priorityError, setPriorityError] = useState('')
  const [progressError, setProgressError] = useState('')

  const { mode } = useTheme()

  const handleGoBack = () => {
    navigate('/')
  }

  useEffect(() => {
    if (documents) {
      const options = documents.map((user) => ({
        value: user,
        label: user.displayName,
      }))
      setUsers(options)
    }
  }, [documents])

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const statusColors = {
    done: mode === 'light' ? '#B9E6B3' : '#2E7D32',
    working: mode === 'light' ? '#FFEEBA' : '#FFB300',
    stuck: mode === 'light' ? '#FFC3B8' : '#C62828',
    awaiting: mode === 'light' ? '#D1C4E9' : '#6A1B9A',
    notStarted: mode === 'light' ? '#B2DFDB' : '#00897B',
  }

  statusOptions.forEach((option) => {
    option.color = statusColors[option.value] || ''
  })

  const priorityColors = {
    critical: mode === 'light' ? '#FF725C' : '#FF2400',
    high: mode === 'light' ? '#FFAC5C' : '#FF6F00',
    medium: mode === 'light' ? '#FFD65C' : '#FF8C00',
    low: mode === 'light' ? '#B6FF5C' : '#3D9140',
  }

  priorityOptions.forEach((option) => {
    option.color = priorityColors[option.value] || ''
  })

  const handleProgressChange = (e) => {
    const selectedProgress = e.target.value
    if (status === 'notStarted') {
      setProgress(0)
    } else if (status === 'done') {
      setProgress(100)
    } else {
      setProgress(selectedProgress)
    }
  }

  const handleStatusChange = (selectedOption) => {
    setStatus(selectedOption.value)
    if (selectedOption.value === 'notStarted') {
      setProgress(0)
    } else if (selectedOption.value === 'done') {
      setProgress(100)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let hasErrors = false

    if (!category) {
      setCategoryError('Please select a project category')
      hasErrors = true
    } else {
      setCategoryError('')
    }

    if (assignedUsers.length < 1) {
      setAssignedUsersError('Please assign the project to at least 1 user')
      hasErrors = true
    } else {
      setAssignedUsersError('')
    }

    if (!status) {
      setStatusError('Please select a status')
      hasErrors = true
    } else {
      setStatusError('')
    }

    if (!priority) {
      setPriorityError('Please select a priority')
      hasErrors = true
    } else {
      setPriorityError('')
    }

    if (progress < 0 || progress > 100) {
      setProgressError(
        'Invalid progress value! Progress should be between 0 and 100'
      )
      hasErrors = true
    } else {
      setProgressError('')
    }

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
    }

    const assignedUsersList = assignedUsers.map(({ value }) => ({
      displayName: value.displayName,
      photoURL: value.photoURL,
      id: value.id,
    }))

    const project = {
      name,
      details,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      category: category.value,
      assignedUsersList,
      status,
      priority,
      progress,
      comments: [],
      createdBy,
    }

    // No errors, submit the form and navigate to homepage
    if (!hasErrors && !response.error) {
      await addDocument(project)
      // console.log(project)
      navigate('/')
    }
  }

  return (
    <>
      <div className="d-flex justify-content-start align-items-start">
        <Button
          onClick={handleGoBack}
          className={`position-relative start-0 mt-0 ml-3 ${
            mode === 'dark' ? styles['my-button-dark'] : styles['my-button']
          }`}
          type="submit"
          variant="light"
          size="md"
        >
          <Image
            className={styles.arrow}
            aria-label="chevron left"
            src={mode === 'dark' ? ArrowLeftDark : ArrowLeftLight}
            alt="arrow left"
            width={35}
            height={35}
          />
        </Button>
      </div>
      <Container>
        <div
          className={`my-auto ${
            mode === 'dark' ? styles['create-form-dark'] : styles['create-form']
          }`}
        >
          <Form className="mb-4" onSubmit={handleSubmit}>
            <h2 className="fs-2 fw-bolder text-center mb-3">
              Create a new project
            </h2>

            <Row className="justify-content-center">
              <Col xs={12} md={6}>
                <Form.Group controlId="projectName" className="mb-3">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    className={`${
                      mode === 'dark' ? styles['form-control-dark'] : ''
                    }`}
                    required
                    type="text"
                    placeholder="Enter project name"
                    onChange={(e) =>
                      setName(capitalizeFirstLetter(e.target.value))
                    }
                    value={name}
                    aria-label="Project Name"
                    aria-describedby="ProjectNameInput"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col xs={12} md={6}>
                <Form.Group controlId="projectDetails" className="mb-3">
                  <Form.Label>Project Details</Form.Label>
                  <Form.Control
                    className={`${
                      mode === 'dark' ? styles['form-control-dark'] : ''
                    }`}
                    required
                    as="textarea"
                    placeholder="Enter project details"
                    onChange={(e) =>
                      setDetails(capitalizeFirstLetter(e.target.value))
                    }
                    value={details}
                    aria-label="Project Details"
                    aria-describedby="ProjectDetailsInput"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col xs={12} md={6}>
                <Form.Group controlId="projectDueDate" className="mb-3">
                  <Form.Label>Set due date</Form.Label>
                  <Form.Control
                    className={`${
                      mode === 'dark'
                        ? `${styles['form-control-dark']} ${styles['form-control-dark-calendar']}`
                        : ''
                    }`}
                    required
                    type="date"
                    placeholder="Enter project due date"
                    onChange={(e) => setDueDate(e.target.value)}
                    value={dueDate}
                    aria-label="Project Due Date"
                    aria-describedby="ProjectDueDateInput"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col xs={12} md={6}>
                <Form.Group controlId="projectCategory" className="mb-3">
                  <Form.Label>Project Category</Form.Label>
                  <Select
                    onChange={(option) => setCategory(option)}
                    options={categories}
                    placeholder="Select project Category"
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        backgroundColor: mode === 'dark' ? '#32383e' : '#fff',
                        borderColor: state.isFocused
                          ? mode === 'dark'
                            ? '#3b434b'
                            : '#80bdff'
                          : provided.borderColor,
                        boxShadow: state.isFocused
                          ? mode === 'dark'
                            ? '0 0 0 0.2rem rgba(255, 255, 255, 0.25)'
                            : '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
                          : provided.boxShadow,
                        '&:hover': {
                          backgroundColor: mode === 'dark' ? '#2c3136' : '',
                          borderColor: 'none',
                        },
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused
                          ? mode === 'dark'
                            ? '#2c3136'
                            : '#f0f0f0'
                          : provided.backgroundColor,
                        color: state.isFocused
                          ? mode === 'dark'
                            ? '#f8f9df'
                            : '#212529'
                          : provided.color,
                      }),
                      menu: (provided) => ({
                        ...provided,
                        backgroundColor: mode === 'dark' ? '#32383e' : '#fff',
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: mode === 'dark' ? '#f8f9df' : '#212529',
                      }),
                    }}
                  />
                  {categoryError && (
                    <Form.Text id="ProjectCategoryErrorBlock" muted>
                      {categoryError}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col xs={12} md={6}>
                <Form.Group controlId="projectAssignTo" className="mb-3">
                  <Form.Label>Assign to</Form.Label>
                  <Select
                    onChange={(option) => setAssignedUsers(option)}
                    options={users}
                    placeholder="Select project assignee"
                    isMulti
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        backgroundColor: mode === 'dark' ? '#32383e' : '#fff',
                        borderColor: state.isFocused
                          ? mode === 'dark'
                            ? '#3b434b'
                            : '#80bdff'
                          : provided.borderColor,
                        boxShadow: state.isFocused
                          ? mode === 'dark'
                            ? '0 0 0 0.2rem rgba(255, 255, 255, 0.25)'
                            : '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
                          : provided.boxShadow,
                        '&:hover': {
                          backgroundColor: mode === 'dark' ? '#2c3136' : '',
                          borderColor: 'none',
                        },
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused
                          ? mode === 'dark'
                            ? '#2c3136'
                            : '#f0f0f0'
                          : provided.backgroundColor,
                        color: state.isFocused
                          ? mode === 'dark'
                            ? '#f8f9df'
                            : '#212529'
                          : provided.color,
                        '&:hover': {
                          backgroundColor: mode === 'dark' ? '#2c3136' : '',
                          borderColor: 'none',
                        },
                      }),
                      menu: (provided) => ({
                        ...provided,
                        backgroundColor: mode === 'dark' ? '#32383e' : '#fff',
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        backgroundColor:
                          mode === 'dark' ? '#0069D9' : '#EBECF0',
                        borderRadius: '4px',
                        color: mode === 'dark' ? '#f8f9df' : '#212529',
                        '&:hover': {
                          backgroundColor:
                            mode === 'dark' ? '#0052A3' : '#CED2DB',
                          color: mode === 'dark' ? '#f8f9df' : '#212529',
                        },
                      }),
                      multiValueLabel: (provided) => ({
                        ...provided,
                        color: mode === 'dark' ? '#f8f9df' : '#212529',
                      }),
                      multiValueRemove: (provided) => ({
                        ...provided,
                        backgroundColor: 'transparent',
                        color: mode === 'dark' ? '#f8f9df' : '#212529',
                        ':hover': {
                          backgroundColor:
                            mode === 'dark' ? '#C62828' : '#FFC3B8',
                          color: mode === 'dark' ? '#f8f9df' : '#212529',
                        },
                      }),
                    }}
                  />
                  {assignedUsersError && (
                    <Form.Text id="ProjectAssignToErrorBlock" muted>
                      {assignedUsersError}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col xs={12} md={6}>
                <Form.Group controlId="projectStatus" className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find(
                      (option) => option.value === status
                    )}
                    onChange={handleStatusChange}
                    placeholder="Select a status"
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        backgroundColor: status
                          ? statusOptions.find(
                              (option) => option.value === status
                            ).color
                          : mode === 'dark'
                          ? '#32383e'
                          : '#fff',
                        borderColor: state.isFocused
                          ? mode === 'dark'
                            ? '#3b434b'
                            : '#80bdff'
                          : provided.borderColor,
                        boxShadow: state.isFocused
                          ? mode === 'dark'
                            ? '0 0 0 0.2rem rgba(255, 255, 255, 0.25)'
                            : '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
                          : provided.boxShadow,
                        '&:hover': {
                          backgroundColor: status
                            ? statusOptions.find(
                                (option) => option.value === status
                              ).color
                            : mode === 'dark'
                            ? '#2c3136'
                            : '',
                          borderColor: 'none',
                        },
                      }),
                      option: (provided, { data }) => ({
                        ...provided,
                        backgroundColor: data.color,
                        ':hover': {
                          filter:
                            mode === 'dark'
                              ? 'brightness(80%)'
                              : 'brightness(120%)',
                        },
                      }),
                      menu: (provided) => ({
                        ...provided,
                        backgroundColor: mode === 'dark' ? '#32383e' : '#fff',
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: mode === 'dark' ? '#f8f9df' : '#212529',
                      }),
                    }}
                  />
                  {statusError && (
                    <Form.Text id="StatusErrorBlock" muted>
                      {statusError}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col xs={12} md={6}>
                <Form.Group controlId="projectPriority" className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Select
                    options={priorityOptions}
                    value={priorityOptions.find(
                      (option) => option.value === priority
                    )}
                    onChange={(selectedOption) =>
                      setPriority(selectedOption.value)
                    }
                    placeholder="Select a priority"
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        backgroundColor: priority
                          ? priorityOptions.find(
                              (option) => option.value === priority
                            ).color
                          : mode === 'dark'
                          ? '#32383e'
                          : '#fff',
                        borderColor: state.isFocused
                          ? mode === 'dark'
                            ? '#3b434b'
                            : '#80bdff'
                          : provided.borderColor,
                        boxShadow: state.isFocused
                          ? mode === 'dark'
                            ? '0 0 0 0.2rem rgba(255, 255, 255, 0.25)'
                            : '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
                          : provided.boxShadow,
                        '&:hover': {
                          backgroundColor: priority
                            ? priorityOptions.find(
                                (option) => option.value === priority
                              ).color
                            : mode === 'dark'
                            ? '#2c3136'
                            : '',
                          borderColor: 'none',
                        },
                      }),
                      option: (provided, { data }) => ({
                        ...provided,
                        backgroundColor: data.color,
                        ':hover': {
                          filter:
                            mode === 'dark'
                              ? 'brightness(80%)'
                              : 'brightness(120%)',
                        },
                      }),
                      menu: (provided) => ({
                        ...provided,
                        backgroundColor: mode === 'dark' ? '#32383e' : '#fff',
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: mode === 'dark' ? '#f8f9df' : '#212529',
                      }),
                    }}
                  />
                  {priorityError && (
                    <Form.Text id="PriorityErrorBlock" muted>
                      {priorityError}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col xs={12} md={6}>
                <Form.Group controlId="projectProgress" className="mb-3">
                  <Form.Label>Progress</Form.Label>
                  <Form.Control
                    className={`${
                      mode === 'dark' ? styles['form-control-dark'] : ''
                    }`}
                    type="range"
                    min={0}
                    max={100}
                    value={progress}
                    onChange={handleProgressChange}
                  />
                  {progressError && (
                    <Form.Text id="ProgressErrorBlock" muted>
                      {progressError}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col xs={12} md={6}>
                <ProgressBar
                  className={`rounded-pill mb-3 ${
                    mode === 'dark' ? styles['form-control-dark'] : ''
                  }`}
                  variant="success"
                  now={progress}
                  label={`${progress}%`}
                  min={0}
                  max={100}
                />
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col xs={12} md={6} className="mb-5">
                <Button
                  className={`w-100 my-3 fw-semibold ${
                    mode === 'dark'
                      ? styles['my-button-dark']
                      : styles['my-button']
                  }`}
                  type="submit"
                  variant="light"
                  size="md"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Loading
                    </>
                  ) : (
                    'Add Project'
                  )}
                </Button>
                {error && <p>{error}</p>}
              </Col>
            </Row>
          </Form>
        </div>
      </Container>
    </>
  )
}
