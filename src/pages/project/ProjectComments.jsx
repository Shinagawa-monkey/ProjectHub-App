import { useState } from 'react'
import { timestamp } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useTheme } from '../../hooks/useTheme'
import { v4 as uuidv4 } from 'uuid'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useFirestore } from '../../hooks/useFirestore'
import Avatar from '../../components/Avatar'

//styles
import styles from './Project.module.css'
import DeleteIconRed from '../../assets/delete_IconRed.svg'
import DeleteIconWhite from '../../assets/delete_IconWhite.svg'
import editIconLight from '../../assets/edit_iconLight.svg'
import editIconDark from '../../assets/edit_iconDark.svg'
import {
  Form,
  Button,
  Card,
  Image,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'

export default function ProjectComments({ project }) {
  const { updateDocument, response } = useFirestore('projects')
  const { mode } = useTheme()
  const [newComment, setNewComment] = useState('')
  const { user } = useAuthContext()
  const uniqueId = uuidv4()
  const [hoveredButton, setHoveredButton] = useState(null)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editedComment, setEditedComment] = useState('')

  const handleEditClick = (commentId, commentContent) => {
    setEditingCommentId(commentId)
    setEditedComment(commentContent)
  }

  const handleSaveClick = async (commentId) => {
    await updateDocument(project.id, {
      comments: project.comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, content: editedComment }
        }
        return comment
      }),
    })
    setEditingCommentId(null)
    setEditedComment('')
  }

  const handleCancelClick = () => {
    setEditingCommentId(null)
    setEditedComment('')
  }

  const handleMouseEnter = (comment) => {
    setHoveredButton(comment.id)
  }

  const handleMouseLeave = () => {
    setHoveredButton(null)
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const commentToAdd = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      content: newComment,
      createdAt: timestamp.fromDate(new Date()),
      id: uniqueId,
    }
    await updateDocument(project.id, {
      comments: [...project.comments, commentToAdd],
    })
    if (!response.error) {
      setNewComment('')
    }
  }

  const handleClick = async (commentId) => {
    await updateDocument(project.id, {
      comments: project.comments.filter((comment) => comment.id !== commentId),
    })
  }

  return (
    <Card
      className={`${mode === 'dark' ? styles['card-dark'] : styles['card']}`}
    >
      <Card.Body className="pt-2 pb-3">
        <h4 className="mb-2">Project Comments</h4>

        {project && project.comments && project.comments.length > 0 ? (
          project.comments.map((comment) => (
            <Card
              key={comment.id}
              className={`mb-3 ${
                mode === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'
              }`}
            >
              <Card.Body className="d-flex flex-column">
                <div
                  className={`${styles['comment-author']} d-flex align-items-center mb-1`}
                >
                  <div className="d-flex align-items-center flex-grow-1">
                    <div className="mr-2">
                      <Avatar
                        src={comment.photoURL}
                        size={32}
                        padding={false}
                      />
                    </div>
                    <p className="ms-2 fw-bolder">{comment.displayName}</p>
                  </div>

                  {user.displayName === comment.displayName && (
                    <div className="ms-auto">
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id="delete-tooltip">Delete Comment</Tooltip>
                        }
                      >
                        <Button
                          className={`${
                            mode === 'dark' ? styles['delete-button'] : ''
                          }`}
                          variant={
                            mode === 'dark' ? 'outline-light' : 'outline-danger'
                          }
                          onClick={() => handleClick(comment.id)}
                          size="sm"
                          onMouseEnter={() => handleMouseEnter(comment)}
                          onMouseLeave={handleMouseLeave}
                          style={{
                            boxShadow:
                              hoveredButton === comment.id
                                ? '0 0 5px rgba(0, 0, 0, 0.3)'
                                : 'none',
                            transition: 'box-shadow 0.3s',
                          }}
                        >
                          <Image
                            aria-label="delete icon"
                            src={
                              hoveredButton === comment.id
                                ? mode === 'dark'
                                  ? DeleteIconRed
                                  : DeleteIconWhite
                                : mode === 'dark'
                                ? DeleteIconWhite
                                : DeleteIconRed
                            }
                            alt="delete icon"
                            width={20}
                            height={20}
                          />
                        </Button>
                      </OverlayTrigger>
                    </div>
                  )}
                </div>
                <div
                  className={`${styles['comment-date']} fs-6 ${
                    mode === 'dark' ? '' : 'text-secondary'
                  }`}
                >
                  <p>
                    {formatDistanceToNow(comment.createdAt.toDate(), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                {editingCommentId === comment.id ? (
                  <div className={styles['edit-comment-container']}>
                    <Form.Control
                      className={`mb-2 ${
                        mode === 'dark'
                          ? `${styles['form-control-dark']} ${styles['scrollbar-dark']}`
                          : styles['scrollbar-light']
                      }`}
                      required
                      as="textarea"
                      placeholder="Enter project comment"
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      aria-label="Project Comments"
                      aria-describedby="ProjectCommentsInput"
                    />
                    <div className={styles['edit-buttons']}>
                      <Button
                        type="submit"
                        className={`fw-semibold me-2 ${
                          mode === 'dark'
                            ? styles['my-button-dark']
                            : styles['my-button']
                        }`}
                        variant={
                          mode === 'dark' ? 'outline-light' : 'outline-success'
                        }
                        size="md"
                        onClick={() => handleSaveClick(comment.id)}
                      >
                        Save
                      </Button>

                      <Button
                        type="button"
                        className={`ms-2 ${
                          mode === 'dark' ? styles['delete-button'] : ''
                        }`}
                        variant={
                          mode === 'dark' ? 'outline-light' : 'outline-danger'
                        }
                        size="md"
                        onClick={() => handleCancelClick()}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`d-flex justify-content-between ${styles['comment-content']}`}
                  >
                    <p
                      className={`flex-grow-1 ${styles['comment-text']} ${
                        mode === 'dark'
                          ? styles['scrollbar-dark']
                          : styles['scrollbar-light']
                      }`}
                    >
                      {comment.content}
                    </p>
                    {user.displayName === comment.displayName && (
                      <Image
                        className={`px-1 mode === 'dark' ? styles['edit-dark'] : ''`}
                        src={mode === 'dark' ? editIconDark : editIconLight}
                        alt="Edit Comment"
                        onClick={() =>
                          handleEditClick(comment.id, comment.content)
                        }
                        style={{
                          cursor: 'pointer',
                          width: '2.3rem',
                          height: '2.3rem',
                        }}
                      />
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          ))
        ) : (
          <p className={`mb-2 ${mode === 'dark' ? '' : 'text-secondary'}`}>
            No comments yet. Be the first!
          </p>
        )}

        <Form onSubmit={handleSubmit} className="add-comment">
          <Form.Group controlId="projectComments" className="mb-2">
            <Form.Label className="mb-2">Add new comment</Form.Label>
            <Form.Control
              className={`${
                mode === 'dark' ? styles['form-control-dark'] : ''
              }`}
              required
              as="textarea"
              placeholder="Enter project comment"
              onChange={(e) =>
                setNewComment(capitalizeFirstLetter(e.target.value))
              }
              value={newComment}
              aria-label="Project Comments"
              aria-describedby="ProjectCommentsInput"
            />
          </Form.Group>
          <Button
            className={`w-100 mt-1 fw-semibold ${
              mode === 'dark' ? styles['my-button-dark'] : styles['my-button']
            }`}
            type="submit"
            variant="light"
            size="md"
          >
            Add Comment
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
