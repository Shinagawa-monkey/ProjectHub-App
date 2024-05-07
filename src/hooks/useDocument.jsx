import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

export const useDocument = (collectionName, id) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)

  // Realtime data for document
  useEffect(() => {
    const documentRef = doc(db, collectionName, id)
    const unsubscribe = onSnapshot(
      documentRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setDocument({ ...snapshot.data(), id: snapshot.id })
          setError(null)
        } else {
          setError('No such document exists')
        }
      },
      (err) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(err.message)
        }
        setError('Failed to get document')
      }
    )

    // Unsubscribe on unmount
    return () => unsubscribe()
  }, [collectionName, id])

  return { document, error }
}
