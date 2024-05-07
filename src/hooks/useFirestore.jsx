import { useReducer, useEffect, useState } from 'react'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { db, timestamp } from '../firebase/config'

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
}

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return {
        ...state,
        isPending: true,
        document: null,
        success: false,
        error: null,
      }
    case 'ADDED_DOCUMENT':
      return {
        ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      }
    case 'DELETED_DOCUMENT':
      return {
        ...state,
        isPending: false,
        document: null,
        success: true,
        error: null,
      }
    case 'UPDATED_DOCUMENT':
      return {
        ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      }
    case 'ERROR':
      return {
        ...state,
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export const useFirestore = (collectionName) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState)

  // Handling cleanup
  const [isCancelled, setIsCancelled] = useState(false)

  // Firestore collection reference
  const collectionRef = collection(db, collectionName)

  // Only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }

  // Add a document (before called docData as doc)
  const addDocument = async (docData) => {
    dispatch({ type: 'IS_PENDING' })

    try {
      const createdAt = timestamp.now()
      const addedDocument = await addDoc(collectionRef, {
        ...docData,
        createdAt,
      })
      dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument })
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
    }
  }

  // Delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' })

    try {
      await deleteDoc(doc(collectionRef, id))
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' })
    } catch (err) {
      dispatchIfNotCancelled({
        type: 'ERROR',
        payload: "Can't delete the item",
      })
    }
  }

  // Update a document
  const updateDocument = async (id, updates) => {
    dispatch({ type: 'IS_PENDING' })

    try {
      const updatedDocument = await updateDoc(doc(collectionRef, id), updates)
      dispatchIfNotCancelled({
        type: 'UPDATED_DOCUMENT',
        payload: updatedDocument,
      })
      return updatedDocument
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
      return null
    }
  }

  // Clean up function
  useEffect(() => {
    setIsCancelled(false)
    return () => setIsCancelled(true)
  }, [])

  return { addDocument, deleteDocument, updateDocument, response }
}
