import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

//styles
import styles from './SearchBar.module.css'
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap'

export default function SearchBar() {
  const { mode } = useTheme()
  const [term, setTerm] = useState('')
  const navigate = useNavigate()

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/search?q=${term}`)
  }

  const handleClear = () => {
    setTerm('')
  }

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup className="ms-2">
        <FormControl
          className={`${mode === 'dark' ? styles['form-control-dark'] : ''}`}
          required
          type="text"
          placeholder="Search projects"
          onChange={(e) => setTerm(capitalizeFirstLetter(e.target.value))}
          value={term}
          aria-label="Project Name Search"
          aria-describedby="ProjectNameSearchInput"
        />
        {term && (
          <Button
            className={`fs-5 mx-1 ${
              mode === 'dark'
                ? styles['delete-button-dark']
                : styles['delete-button']
            }`}
            variant={mode === 'dark' ? 'outline-light' : 'outline-danger'}
            onClick={handleClear}
            size="sm"
          >
            &times;
          </Button>
        )}
      </InputGroup>
    </Form>
  )
}
