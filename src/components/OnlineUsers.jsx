import React from 'react'
import Avatar from './Avatar'
import { useCollection } from '../hooks/useCollection'
import { useTheme } from '../hooks/useTheme'

// Styles & images
//import styles from './OnlineUsers.module.css'
import { Badge, ListGroup } from 'react-bootstrap'

export default function OnlineUsers() {
  const { mode } = useTheme()
  const { documents, error } = useCollection('users')

  return (
    <ListGroup variant="flush">
      {documents &&
        documents.map((user) => (
          <React.Fragment key={user.id}>
            <ListGroup.Item
              className={`p-0 ${mode === 'dark' ? 'text-light' : ''}`}
              style={{
                backgroundColor: mode === 'light' ? '#D8A8F8' : '#4E2A84',
              }}
              action
            >
              <div className="d-flex align-items-center">
                <div className="col-auto">
                  <Avatar src={user.photoURL} />
                </div>
                <div className="col ps-2">
                  <p className="text-wrap">{user.displayName}</p>
                  <>
                    {user.online ? (
                      <Badge
                        pill
                        bg="success"
                        text={mode === 'dark' ? '' : 'dark'}
                      >
                        Online
                      </Badge>
                    ) : (
                      <Badge
                        pill
                        bg="danger"
                        text={mode === 'dark' ? '' : 'dark'}
                      >
                        Offline
                      </Badge>
                    )}
                  </>
                </div>
              </div>
            </ListGroup.Item>
          </React.Fragment>
        ))}
      {error && <p>{error}</p>}
    </ListGroup>
  )
}
