import { useState, useEffect, useRef } from 'react'
import { useSignup } from '../../hooks/useSignup'
import { useTheme } from '../../hooks/useTheme'
import { checkEmailAvailability } from '../../firebase/config'

//styles
import styles from './Signup.module.css'
import { Form, Button, Spinner, Card } from 'react-bootstrap'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailError, setThumbnailError] = useState(null)
  const { error, isPending, signup, uploadProgress } = useSignup()
  const confirmRef = useRef()
  const maxCharacterLimit = 20
  const [emailTaken, setEmailTaken] = useState(false)

  const { mode } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.length < 6) {
      // console.log('Password should be at least 6 characters long.')
    } else if (!passwordMismatch) {
      // Check if the email is already taken
      const isEmailTaken = await checkEmailAvailability(email)
      if (isEmailTaken) {
        setEmailTaken(true)
      } else {
        signup(email, password, displayName, thumbnail)
        // console.log(email, password, displayName, thumbnail)
      }
    }
  }

  const handleDisplayNameChange = (e) => {
    const value = e.target.value.trim()
    if (value.length <= maxCharacterLimit) {
      setDisplayName(value)
    }
  }

  const handleFileChange = (e) => {
    setThumbnailError(null)
    setThumbnail(null)
    let selected = e.target.files[0]
    if (!selected) {
      setThumbnailError('Please select a profile image')
    } else if (!selected.type.includes('image')) {
      setThumbnailError('Selected file must be an image')
    } else if (selected.size > 100000) {
      setThumbnailError('The file is too large. Allowed maximum size is 100KB')
    } else {
      setThumbnailError(null)
      setThumbnail(selected)
      // console.log('Profile image is updated')
    }
  }

  useEffect(() => {
    if (password && confirmRef.current.value.length > 0) {
      setPasswordMismatch(password !== confirmPassword)
    } else {
      setPasswordMismatch(false)
    }

    // Clear confirm password when password is cleared
    if (!password) {
      setConfirmPassword('')
    }
  }, [password, confirmPassword])

  return (
    <Card
      className={`mt-1 mb-5 ${styles['signup-form']}`}
      data-bs-theme={mode === 'light' ? null : 'dark'}
    >
      <Form onSubmit={handleSubmit}>
        <h1 className="fs-2 fw-bolder text-center mb-3">Signup</h1>

        <Form.Group controlId="signupEmail" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            aria-label="Email address"
            aria-describedby="emailInput"
          />
          {emailTaken && (
            <Form.Text className="text-danger">
              This email is already taken. Please log in instead.
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="signupPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            aria-label="Password"
            aria-describedby="passwordInput"
            minLength={6}
            isInvalid={password.length > 0 && password.length < 6}
          />
          {password.length > 0 && password.length < 6 && (
            <Form.Text className="text-danger">
              Password should be at least 6 characters long.
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="signupConfirmPassword" className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            className={`${
              mode === 'dark'
                ? styles['form-control-dark']
                : styles['form-control-light']
            }`}
            required
            type="password"
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            disabled={password === ''}
            aria-label="Confirm Password"
            aria-describedby="confirmPasswordInput"
            ref={confirmRef}
          />
          {passwordMismatch && (
            <Form.Text
              id="passwordConfirmationErrorBlock"
              className="text-danger"
            >
              Passwords do not match. Please check again!
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="signupDisplayName" className="mb-3">
          <Form.Label>Display Name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter your name"
            onChange={handleDisplayNameChange}
            value={displayName}
            aria-label="Enter your name"
            aria-describedby="displayNameInput"
            maxLength={maxCharacterLimit}
          />
          <Form.Text className={mode === 'dark' ? 'text-light' : 'text-muted'}>
            {`${maxCharacterLimit - displayName.length} characters remaining`}
          </Form.Text>
          {displayName.length > maxCharacterLimit && (
            <Form.Text className="text-danger">
              Exceeded character limit.
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="signupProfilePicture" className="mb-3">
          <Form.Label>Profile Picture Thumbnail</Form.Label>
          <Form.Control
            required
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            // value={displayName}
            aria-label="Choose your profile picture"
            aria-describedby="uploadProfilePictureInput"
          />
          {thumbnailError && (
            <Form.Text
              id="uploadProfilePictureErrorBlock"
              className="text-danger"
            >
              {thumbnailError}
            </Form.Text>
          )}
          {uploadProgress > 0 && (
            <Form.Text
              id="uploadProfilePictureProgressBlock"
              className={mode === 'dark' ? 'text-light' : 'text-muted'}
            >
              {`Uploaded ${uploadProgress} %`}
            </Form.Text>
          )}
        </Form.Group>

        {!isPending && (
          <Button
            className={`w-100 my-3 fw-semibold ${
              mode === 'dark' ? styles['my-button-dark'] : styles['my-button']
            }`}
            type="submit"
            variant="light"
            size="md"
          >
            Sign Up
          </Button>
        )}

        {isPending && (
          <Button
            className={`w-100 my-3 fw-semibold ${
              mode === 'dark' ? styles['my-button-dark'] : styles['my-button']
            }`}
            type="submit"
            variant="light"
            size="md"
            disabled={passwordMismatch}
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
        )}
        {error && <p className="text-danger">{error}</p>}
      </Form>
    </Card>
  )
}
