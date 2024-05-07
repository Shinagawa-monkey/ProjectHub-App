import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
import { useTheme } from '../../hooks/useTheme'

//styles
import styles from './Login.module.css'
import { Form, Button, Spinner, Card } from 'react-bootstrap'

export default function Login() {
  const { mode } = useTheme()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isPending } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log(email, password);
    login(email, password)
  }

  return (
    <Card
      className={styles['login-form']}
      data-bs-theme={mode === 'light' ? null : 'dark'}
    >
      <Form onSubmit={handleSubmit} className="mb-4">
        <h1 className="fs-2 mb-4 fw-bolder text-center">Login</h1>

        <Form.Group controlId="loginEmail" className="mb-3">
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
        </Form.Group>

        <Form.Group controlId="loginPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            aria-label="Password"
            aria-describedby="passwordInput"
          />
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
            Login
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
        )}
        {error && (
          <p className={mode === 'dark' ? 'text-danger' : 'text-muted'}>
            {error}
          </p>
        )}
      </Form>
    </Card>
  )
}
