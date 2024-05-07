import Avatar from '../../components/Avatar'
import {
  Card,
  ProgressBar,
  Row,
  Col,
  Button,
  Image,
  OverlayTrigger,
  Tooltip,
  Form,
} from 'react-bootstrap'
import { useTheme } from '../../hooks/useTheme'
import { useFirestore } from '../../hooks/useFirestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Select from 'react-select'
import { timestamp } from '../../firebase/config'
import { useCollection } from '../../hooks/useCollection'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'

//styles
import styles from './Project.module.css'
import editIconLight from '../../assets/edit_iconLight.svg'
import editIconDark from '../../assets/edit_iconDark.svg'
import DeleteIconRed from '../../assets/delete_IconRed.svg'
import DeleteIconWhite from '../../assets/delete_IconWhite.svg'

export default function ProjectSummary({ project, updateProject }) {
  const { mode } = useTheme()
  const { deleteDocument, updateDocument } = useFirestore('projects')
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(project.name)
  const [editingDueDate, setEditingDueDate] = useState(false)
  const [dueDate, setDueDate] = useState(project.dueDate)
  const [editingDetails, setEditingDetails] = useState(false)
  const [details, setDetails] = useState(project.details)
  const { documents: users } = useCollection('users')
  const [editingAssignedUsersList, setEditingAssignedUsersList] =
    useState(false)
  const [assignedUsers, setAssignedUsers] = useState([
    ...project.assignedUsersList,
  ])
  const [editingProgress, setEditingProgress] = useState(false)
  const [progress, setProgress] = useState(project.progress)

  const userOptions = users
    ? users.map((user) => ({
        value: user.id,
        label: user.displayName,
      }))
    : []

  const handleMouseEnter = () => {
    setHovered(true)
  }

  const handleMouseLeave = () => {
    setHovered(false)
  }

  const imageSrc = hovered
    ? mode === 'dark'
      ? DeleteIconRed
      : DeleteIconWhite
    : mode === 'dark'
    ? DeleteIconWhite
    : DeleteIconRed

  const categories = [
    { value: 'design', label: 'Design' },
    { value: 'hr', label: 'HR' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'management', label: 'Project Management' },
    { value: 'sales', label: 'Sales & CRM' },
    { value: 'development', label: 'Software Development' },
  ]

  const [editingCategory, setEditingCategory] = useState(false)
  const [category, setCategory] = useState(
    categories.find((option) => option.value === project.category)
  )

  const statusColors = {
    done: mode === 'light' ? '#B9E6B3' : '#2E7D32',
    working: mode === 'light' ? '#FFEEBA' : '#FFB300',
    stuck: mode === 'light' ? '#FFC3B8' : '#C62828',
    awaiting: mode === 'light' ? '#D1C4E9' : '#6A1B9A',
    notStarted: mode === 'light' ? '#B2DFDB' : '#00897B',
  }

  const statusOptions = [
    {
      value: 'done',
      label: 'Done',
      style: { backgroundColor: statusColors.done },
    },
    {
      value: 'working',
      label: 'Working on it',
      style: { backgroundColor: statusColors.working },
    },
    {
      value: 'stuck',
      label: 'Stuck',
      style: { backgroundColor: statusColors.stuck },
    },
    {
      value: 'awaiting',
      label: 'Awaiting review',
      style: { backgroundColor: statusColors.awaiting },
    },
    {
      value: 'notStarted',
      label: 'Not Started',
      style: { backgroundColor: statusColors.notStarted },
    },
  ]

  const [editingStatus, setEditingStatus] = useState(false)
  const [status, setStatus] = useState(
    statusOptions.find((option) => option.value === project.status)
  )

  const priorityColors = {
    critical: mode === 'light' ? '#FF725C' : '#FF2400',
    high: mode === 'light' ? '#FFAC5C' : '#FF6F00',
    medium: mode === 'light' ? '#FFD65C' : '#FF8C00',
    low: mode === 'light' ? '#B6FF5C' : '#3D9140',
  }

  const priorityOptions = [
    {
      value: 'critical',
      label: 'Critical',
      style: { backgroundColor: priorityColors.critical },
    },
    {
      value: 'high',
      label: 'High',
      style: { backgroundColor: priorityColors.high },
    },
    {
      value: 'medium',
      label: 'Medium',
      style: { backgroundColor: priorityColors.medium },
    },
    {
      value: 'low',
      label: 'Low',
      style: { backgroundColor: priorityColors.low },
    },
  ]

  const [editingPriority, setEditingPriority] = useState(false)
  const [priority, setPriority] = useState(
    priorityOptions.find((option) => option.value === project.priority)
  )

  const handleClick = (e) => {
    deleteDocument(project.id)
    navigate('/')
  }

  const handleEditName = () => {
    setEditingName(true)
  }

  const handleSaveName = async () => {
    const updatedProject = { ...project, name }
    await updateDocument(project.id, updatedProject)
    setEditingName(false)
  }

  const handleCancelName = () => {
    setName(project.name)
    setEditingName(false)
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handleEditDueDate = () => {
    setEditingDueDate(true)
  }

  const handleSaveDueDate = async () => {
    const updatedProject = {
      ...project,
      dueDate: timestamp.fromDate(new Date(dueDate)),
    }
    await updateDocument(project.id, updatedProject)
    setEditingDueDate(false)
  }

  const handleCancelDueDate = () => {
    setDueDate(project.dueDate)
    setEditingDueDate(false)
  }

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value)
  }

  const handleEditDetails = () => {
    setEditingDetails(true)
  }

  const handleSaveDetails = async () => {
    const updatedProject = { ...project, details }
    await updateDocument(project.id, updatedProject)
    setEditingDetails(false)
  }

  const handleCancelDetails = () => {
    setDetails(project.details)
    setEditingDetails(false)
  }

  const handleEditAssignedUsersList = () => {
    setEditingAssignedUsersList(true)
  }

  const handleSaveAssignedUsersList = async () => {
    try {
      // Fetch the complete user objects for each assigned user
      const updatedAssignedUsers = await Promise.all(
        assignedUsers.map(async (user) => {
          const userDocRef = doc(db, 'users', user.id)
          const userSnapshot = await getDoc(userDocRef)
          const userData = userSnapshot.data()
          return { ...user, photoURL: userData.photoURL }
        })
      )

      // Update the project with the new assignedUsers list
      const updatedProject = {
        ...project,
        assignedUsersList: updatedAssignedUsers,
      }
      await updateDocument(project.id, updatedProject)
      setEditingAssignedUsersList(false)
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(error)
      }
    }
  }

  const handleCancelAssignedUsersList = () => {
    // Reset the assignedUsers to the original list
    setAssignedUsers([...project.assignedUsersList])
    setEditingAssignedUsersList(false)
  }

  const handleAssignedUsersChange = (selectedOptions) => {
    // Convert the selectedOptions to the updated assignedUsers list
    const selectedUsers = selectedOptions.map((option) => ({
      id: option.value,
      displayName: option.label,
      photoURL:
        assignedUsers.find((user) => user.id === option.value)?.photoURL || '',
    }))
    setAssignedUsers(selectedUsers)
  }

  const handleEditCategory = () => {
    setEditingCategory(true)
  }

  const handleSaveCategory = async () => {
    const updatedProject = { ...project, category: category.value }
    await updateDocument(project.id, updatedProject)
    setEditingCategory(false)
  }

  const handleCancelCategory = () => {
    setCategory(categories.find((option) => option.value === category.value))
    setEditingCategory(false)
  }

  const handleCategoryChange = (selectedOption) => {
    setCategory(selectedOption)
  }

  const handleEditPriority = () => {
    setEditingPriority(true)
  }

  const handleSavePriority = async () => {
    const updatedProject = { ...project, priority: priority.value }
    await updateDocument(project.id, updatedProject)
    setEditingPriority(false)
  }

  const handleCancelPriority = () => {
    setPriority(
      priorityOptions.find((option) => option.value === priority.value)
    )
    setEditingPriority(false)
  }

  const handlePriorityChange = (selectedOption) => {
    setPriority(selectedOption)
  }

  const handleEditStatus = () => {
    setEditingStatus(true)
  }

  const handleSaveStatus = async () => {
    const updatedProject = { ...project, status: status.value }

    if (status.value === 'notStarted') {
      updatedProject.progress = 0
    } else if (status.value === 'done') {
      updatedProject.progress = 100
    }

    await updateDocument(project.id, updatedProject)
    setEditingStatus(false)
  }

  const handleCancelStatus = () => {
    setStatus(statusOptions.find((option) => option.value === status.value))
    setEditingStatus(false)
  }

  const handleStatusChange = (selectedOption) => {
    setStatus(selectedOption)

    if (selectedOption.value === 'notStarted') {
      setProgress(0)
    } else if (selectedOption.value === 'done') {
      setProgress(100)
    }
  }

  const handleEditProgress = () => {
    setEditingProgress(true)
  }

  const handleSaveProgress = async () => {
    await updateDocument(project.id, { progress })
    setEditingProgress(false)
  }

  const handleCancelProgress = () => {
    setProgress(project.progress)
    setEditingProgress(false)
  }

  const handleProgressChange = (e) => {
    const selectedProgress = parseInt(e.target.value, 10)

    if (status === 'notStarted' && selectedProgress !== 0) {
      setProgress(0)
    } else if (status === 'done' && selectedProgress !== 100) {
      setProgress(100)
    } else {
      setProgress(selectedProgress)
    }
  }

  const isEditable =
    user.uid === project.createdBy.id ||
    project.assignedUsersList.some(
      (assignedUser) => assignedUser.id === user.uid
    )

  return (
    <Card
      className={`${mode === 'dark' ? styles['card-dark'] : styles['card']}`}
    >
      <Card.Header>
        <div className="d-flex align-items-center justify-content-between">
          <Card.Title as="h3" className="fs-4 mb-0">
            {isEditable && editingName ? (
              <div className="d-flex align-items-center">
                <Form.Control
                  className={`${
                    mode === 'dark' ? styles['form-control-dark'] : ''
                  }`}
                  type="text"
                  placeholder="Edit project name"
                  value={name}
                  onChange={handleNameChange}
                  aria-label="Project Name"
                  aria-describedby="ProjectNameInput"
                />
                <Button
                  className={`ms-2 ${
                    mode === 'dark'
                      ? styles['my-button-dark']
                      : styles['my-button']
                  }`}
                  variant={
                    mode === 'dark' ? 'outline-light' : 'outline-success'
                  }
                  size="md"
                  onClick={handleSaveName}
                >
                  Save
                </Button>
                <Button
                  className={`ms-2 ${
                    mode === 'dark' ? styles['delete-button'] : ''
                  }`}
                  variant={mode === 'dark' ? 'outline-light' : 'outline-danger'}
                  size="md"
                  onClick={handleCancelName}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                {project.name}
                {user.uid === project.createdBy.id && (
                  <Image
                    className={`px-1 ${
                      mode === 'dark' ? styles['edit-dark'] : ''
                    }`}
                    src={mode === 'dark' ? editIconDark : editIconLight}
                    alt="Edit Details"
                    onClick={handleEditName}
                    style={{
                      cursor: 'pointer',
                      width: '2.3rem',
                      height: '2.3rem',
                    }}
                  />
                )}
              </>
            )}
          </Card.Title>

          {user.uid === project.createdBy.id && (
            <div className="ml-auto">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="delete-tooltip">Delete Project</Tooltip>}
              >
                <Button
                  className={`mx-auto ${
                    mode === 'dark' ? styles['delete-button'] : ''
                  }`}
                  variant={mode === 'dark' ? 'outline-light' : 'outline-danger'}
                  onClick={() => handleClick()}
                  size="sm"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    boxShadow: hovered ? '0 0 5px rgba(0, 0, 0, 0.3)' : 'none',
                    transition: 'box-shadow 0.3s',
                  }}
                >
                  <Image
                    aria-label="delete icon"
                    src={imageSrc}
                    alt="delete icon"
                    width={25}
                    height={25}
                  />
                </Button>
              </OverlayTrigger>
            </div>
          )}
        </div>

        <Card.Subtitle
          className={`fs-6 my-2 ${mode === 'dark' ? '' : 'text-secondary'}`}
        >
          <p className="fw-bolder mb-2">
            Created By:{' '}
            <span className="fw-normal">{project.createdBy.displayName}</span>
          </p>
          {isEditable && editingDueDate ? (
            <div className="d-flex align-items-center">
              <Form.Control
                className={`w-50 ${
                  mode === 'dark'
                    ? `${styles['form-control-dark']} ${styles['form-control-dark-calendar']}`
                    : ''
                }`}
                type="date"
                placeholder="Edit project due date"
                value={dueDate}
                onChange={handleDueDateChange}
                aria-label="Project Due Date"
                aria-describedby="ProjectDueDateInput"
              />
              <Button
                className={`ms-2 ${
                  mode === 'dark'
                    ? styles['my-button-dark']
                    : styles['my-button']
                }`}
                variant={mode === 'dark' ? 'outline-light' : 'outline-success'}
                size="md"
                onClick={handleSaveDueDate}
              >
                Save
              </Button>
              <Button
                className={`ms-2 ${
                  mode === 'dark' ? styles['delete-button'] : ''
                }`}
                variant={mode === 'dark' ? 'outline-light' : 'outline-danger'}
                size="md"
                onClick={handleCancelDueDate}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <p className="fw-bolder">
              Due Date:{' '}
              <span className="fw-normal">
                {project.dueDate
                  .toDate()
                  .toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })
                  .split(',')}
              </span>
              {user.uid === project.createdBy.id && (
                <Image
                  className={`px-1 ${
                    mode === 'dark' ? styles['edit-dark'] : ''
                  }`}
                  src={mode === 'dark' ? editIconDark : editIconLight}
                  alt="Edit Details"
                  onClick={handleEditDueDate}
                  style={{
                    cursor: 'pointer',
                    width: '2.3rem',
                    height: '2.3rem',
                  }}
                />
              )}
            </p>
          )}
        </Card.Subtitle>
      </Card.Header>

      <Card.Body>
        <Row>
          <Col md={6} xs={12}>
            <Card.Text className="mb-2 fw-bolder">
              Details:{' '}
              {isEditable && editingDetails ? (
                <div className="d-flex align-items-center">
                  <Form.Control
                    className={
                      mode === 'dark'
                        ? `${styles['form-control-dark']} ${styles['scrollbar-dark']}`
                        : styles['scrollbar-light']
                    }
                    as="textarea"
                    rows={3}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                  <Button
                    className={`ms-2 ${
                      mode === 'dark'
                        ? styles['my-button-dark']
                        : styles['my-button']
                    }`}
                    variant={
                      mode === 'dark' ? 'outline-light' : 'outline-success'
                    }
                    size="md"
                    onClick={handleSaveDetails}
                  >
                    Save
                  </Button>
                  <Button
                    className={`ms-2 ${
                      mode === 'dark' ? styles['delete-button'] : ''
                    }`}
                    variant={
                      mode === 'dark' ? 'outline-light' : 'outline-danger'
                    }
                    size="md"
                    onClick={handleCancelDetails}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <span className="fw-normal">{project.details}</span>
                  {user.uid === project.createdBy.id && (
                    <Image
                      className={`px-1 ${
                        mode === 'dark' ? styles['edit-dark'] : ''
                      }`}
                      src={mode === 'dark' ? editIconDark : editIconLight}
                      alt="Edit Details"
                      onClick={handleEditDetails}
                      style={{
                        cursor: 'pointer',
                        width: '2.3rem',
                        height: '2.3rem',
                      }}
                    />
                  )}
                </>
              )}
            </Card.Text>

            <Card.Text className="mb-2 fw-bolder">
              Category:{' '}
              {isEditable && user.uid === project.createdBy.id ? (
                editingCategory ? (
                  <div
                    className={`d-flex align-items-center ${styles['status-edit']}`}
                  >
                    <Select
                      options={categories}
                      value={categories.find(
                        (option) => option.value === category
                      )}
                      onChange={handleCategoryChange}
                      placeholder="Edit a category"
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
                    <Button
                      className={`ms-2 ${
                        mode === 'dark'
                          ? styles['my-button-dark']
                          : styles['my-button']
                      }`}
                      variant={
                        mode === 'dark' ? 'outline-light' : 'outline-success'
                      }
                      size="md"
                      onClick={handleSaveCategory}
                    >
                      Save
                    </Button>
                    <Button
                      className={`ms-2 ${
                        mode === 'dark' ? styles['delete-button'] : ''
                      }`}
                      variant={
                        mode === 'dark' ? 'outline-light' : 'outline-danger'
                      }
                      size="md"
                      onClick={handleCancelCategory}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`px-2 text-capitalize ${
                        isEditable ? styles['editable-status'] : ''
                      }`}
                      style={{
                        borderRadius: '12px',
                        fontWeight: '500',
                        ...categories.find(
                          (option) => option.value === category.value
                        )?.style,
                      }}
                    >
                      {category.value}
                    </span>
                    <Image
                      className={`px-1 ${
                        mode === 'dark' ? styles['edit-dark'] : ''
                      }`}
                      src={mode === 'dark' ? editIconDark : editIconLight}
                      alt="Edit Status"
                      onClick={handleEditCategory}
                      style={{
                        cursor: 'pointer',
                        width: '2.3rem',
                        height: '2.3rem',
                      }}
                    />
                  </>
                )
              ) : (
                <span
                  className={`px-2 text-capitalize ${
                    isEditable ? styles['editable-status'] : ''
                  }`}
                  style={{
                    borderRadius: '12px',
                    fontWeight: '500',
                    ...categories.find(
                      (option) => option.value === category.value
                    )?.style,
                  }}
                >
                  {category.value}
                </span>
              )}
            </Card.Text>

            <Card.Text className="d-flex align-items-center mb-2 fw-bolder">
              Assigned To:
              {isEditable && user.uid === project.createdBy.id ? (
                editingAssignedUsersList ? (
                  <div className={`${styles['status-edit']}`}>
                    <Select
                      isMulti
                      options={userOptions}
                      value={assignedUsers.map((user) => ({
                        value: user.id,
                        label: user.displayName,
                      }))}
                      onChange={handleAssignedUsersChange}
                      placeholder="Edit project assignee"
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
                    <Button
                      className={`ms-2 ${
                        mode === 'dark'
                          ? styles['my-button-dark']
                          : styles['my-button']
                      }`}
                      variant={
                        mode === 'dark' ? 'outline-light' : 'outline-success'
                      }
                      size="md"
                      onClick={handleSaveAssignedUsersList}
                    >
                      Save
                    </Button>
                    <Button
                      className={`ms-2 ${
                        mode === 'dark' ? styles['delete-button'] : ''
                      }`}
                      variant={
                        mode === 'dark' ? 'outline-light' : 'outline-danger'
                      }
                      size="md"
                      onClick={handleCancelAssignedUsersList}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="ms-2 d-flex">
                    {project.assignedUsersList.map((user, index) => (
                      <div key={user.id} className="me-2">
                        <Avatar src={user.photoURL} size={50} padding={false} />
                      </div>
                    ))}
                    <Image
                      className={`px-1 ${
                        mode === 'dark' ? styles['edit-dark'] : ''
                      }`}
                      src={mode === 'dark' ? editIconDark : editIconLight}
                      alt="Edit Status"
                      onClick={handleEditAssignedUsersList}
                      style={{
                        cursor: 'pointer',
                        width: '2.3rem',
                        height: '2.3rem',
                      }}
                    />
                  </div>
                )
              ) : (
                <div className="ms-2 d-flex">
                  {project.assignedUsersList.map((user, index) => (
                    <div key={user.id} className="me-2">
                      <Avatar src={user.photoURL} size={50} padding={false} />
                    </div>
                  ))}
                </div>
              )}
            </Card.Text>
          </Col>

          <Col md={6} xs={12}>
            <Card.Text className="mb-2 fw-bolder">
              Status:{' '}
              {isEditable ? (
                editingStatus ? (
                  <div
                    className={`d-flex align-items-center ${styles['status-edit']}`}
                  >
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
                          backgroundColor:
                            state.selectProps.value?.style?.backgroundColor ||
                            '',
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
                                )?.style?.backgroundColor || ''
                              : mode === 'dark'
                              ? '#2c3136'
                              : '',
                            borderColor: 'none',
                          },
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor:
                            state.data.style?.backgroundColor || '',
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
                        singleValue: (provided, state) => {
                          const selectedStatus = statusOptions.find(
                            (option) => option.value === status
                          )
                          return {
                            ...provided,
                            color: mode === 'dark' ? '#f8f9df' : '#212529',
                            backgroundColor:
                              selectedStatus?.style?.backgroundColor ||
                              'transparent',
                          }
                        },
                      }}
                    />
                    <Button
                      className={`ms-2 ${
                        mode === 'dark'
                          ? styles['my-button-dark']
                          : styles['my-button']
                      }`}
                      variant={
                        mode === 'dark' ? 'outline-light' : 'outline-success'
                      }
                      size="md"
                      onClick={handleSaveStatus}
                    >
                      Save
                    </Button>
                    <Button
                      className={`ms-2 ${
                        mode === 'dark' ? styles['delete-button'] : ''
                      }`}
                      variant={
                        mode === 'dark' ? 'outline-light' : 'outline-danger'
                      }
                      size="md"
                      onClick={handleCancelStatus}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`px-2 text-capitalize ${
                        isEditable ? styles['editable-status'] : ''
                      }`}
                      style={{
                        borderRadius: '12px',
                        fontWeight: '500',
                        ...statusOptions.find(
                          (option) => option.value === status.value
                        )?.style,
                      }}
                    >
                      {status.label}
                    </span>
                    <Image
                      className={`px-1 ${
                        mode === 'dark' ? styles['edit-dark'] : ''
                      }`}
                      src={mode === 'dark' ? editIconDark : editIconLight}
                      alt="Edit Status"
                      onClick={handleEditStatus}
                      style={{
                        cursor: 'pointer',
                        width: '2.3rem',
                        height: '2.3rem',
                      }}
                    />
                  </>
                )
              ) : (
                <span
                  className={`px-2 text-capitalize ${
                    isEditable ? styles['editable-status'] : ''
                  }`}
                  style={{
                    borderRadius: '12px',
                    fontWeight: '500',
                    ...statusOptions.find(
                      (option) => option.value === status.value
                    )?.style,
                  }}
                >
                  {status.label}
                </span>
              )}
            </Card.Text>

            <Card.Text className="mb-2 fw-bolder">
              Priority:{' '}
              {isEditable && user.uid === project.createdBy.id ? (
                editingPriority ? (
                  <div
                    className={`d-flex align-items-center ${styles['status-edit']}`}
                  >
                    <Select
                      options={priorityOptions}
                      value={priorityOptions.find(
                        (option) => option.value === priority
                      )}
                      onChange={handlePriorityChange}
                      placeholder="Select a priority"
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          backgroundColor:
                            state.selectProps.value?.style?.backgroundColor ||
                            '',
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
                                )?.style?.backgroundColor || ''
                              : mode === 'dark'
                              ? '#2c3136'
                              : '',
                            borderColor: 'none',
                          },
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor:
                            state.data.style?.backgroundColor || '',
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
                        singleValue: (provided, state) => {
                          const selectedPriority = priorityOptions.find(
                            (option) => option.value === priority
                          )
                          return {
                            ...provided,
                            color: mode === 'dark' ? '#f8f9df' : '#212529',
                            backgroundColor:
                              selectedPriority?.style?.backgroundColor ||
                              'transparent',
                          }
                        },
                      }}
                    />
                    <Button
                      className={`ms-2 ${
                        mode === 'dark'
                          ? styles['my-button-dark']
                          : styles['my-button']
                      }`}
                      variant={
                        mode === 'dark' ? 'outline-light' : 'outline-success'
                      }
                      size="md"
                      onClick={handleSavePriority}
                    >
                      Save
                    </Button>
                    <Button
                      className={`ms-2 ${
                        mode === 'dark' ? styles['delete-button'] : ''
                      }`}
                      variant={
                        mode === 'dark' ? 'outline-light' : 'outline-danger'
                      }
                      size="md"
                      onClick={handleCancelPriority}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`px-2 text-capitalize ${
                        isEditable ? styles['editable-status'] : ''
                      }`}
                      style={{
                        borderRadius: '12px',
                        fontWeight: '500',
                        ...priorityOptions.find(
                          (option) => option.value === priority.value
                        )?.style,
                      }}
                    >
                      {priority.label}
                    </span>
                    <Image
                      className={`px-1 ${
                        mode === 'dark' ? styles['edit-dark'] : ''
                      }`}
                      src={mode === 'dark' ? editIconDark : editIconLight}
                      alt="Edit Status"
                      onClick={handleEditPriority}
                      style={{
                        cursor: 'pointer',
                        width: '2.3rem',
                        height: '2.3rem',
                      }}
                    />
                  </>
                )
              ) : (
                <span
                  className={`px-2 text-capitalize ${
                    isEditable ? styles['editable-status'] : ''
                  }`}
                  style={{
                    borderRadius: '12px',
                    fontWeight: '500',
                    ...priorityOptions.find(
                      (option) => option.value === priority.value
                    )?.style,
                  }}
                >
                  {priority.label}
                </span>
              )}
            </Card.Text>

            <Card.Text className="mb-2 fw-bolder">
              <div className="d-flex align-items-center">
                Progress:{' '}
                {isEditable ? (
                  editingProgress ? (
                    <div
                      className={`d-flex align-items-center ${styles['progress-edit']}`}
                    >
                      <Form.Control
                        className={`ms-2 w-50 ${
                          mode === 'dark' ? styles['form-control-dark'] : ''
                        }`}
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={progress}
                        onChange={handleProgressChange}
                        aria-label="Project Progress"
                        aria-describedby="ProjectProgressInput"
                      />
                      <Button
                        className={`ms-2 ${
                          mode === 'dark'
                            ? styles['my-button-dark']
                            : styles['my-button']
                        }`}
                        variant={
                          mode === 'dark' ? 'outline-light' : 'outline-success'
                        }
                        size="md"
                        onClick={handleSaveProgress}
                      >
                        Save
                      </Button>
                      <Button
                        className={`ms-2 ${
                          mode === 'dark' ? styles['delete-button'] : ''
                        }`}
                        variant={
                          mode === 'dark' ? 'outline-light' : 'outline-danger'
                        }
                        size="md"
                        onClick={handleCancelProgress}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <ProgressBar
                        className={`rounded-pill ms-2 w-50 fw-normal ${
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
                      <Image
                        className={`px-1 ${
                          mode === 'dark' ? styles['edit-dark'] : ''
                        }`}
                        src={mode === 'dark' ? editIconDark : editIconLight}
                        alt="Edit Progress"
                        onClick={handleEditProgress}
                        style={{
                          cursor: 'pointer',
                          width: '2.3rem',
                          height: '2.3rem',
                        }}
                      />
                    </>
                  )
                ) : (
                  <ProgressBar
                    className={`rounded-pill ms-2 w-50 fw-normal ${
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
                )}
              </div>
            </Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
